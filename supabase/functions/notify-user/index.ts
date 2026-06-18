import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { JWT } from 'https://esm.sh/google-auth-library@9';

serve(async (req) => {
  try {
    const payload = await req.json();
    const { event, table, record, old_record } = payload;

    // 1. Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Authenticate with Firebase HTTP v1 API
    const serviceAccountJson = Deno.env.get('FIREBASE_SERVICE_ACCOUNT');
    if (!serviceAccountJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT secret is missing');
    }
    const serviceAccount = JSON.parse(serviceAccountJson);

    const jwtClient = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    });
    
    const tokens = await jwtClient.getAccessToken();
    const accessToken = tokens.token;
    const fcmUrl = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;

    let targetTokens: string[] = [];
    let title = '';
    let body = '';
    let url = '/orders';

    if (table === 'notifications' && event === 'INSERT') {
      // Direct notification table trigger
      title = record.title;
      body = record.body;
      url = record.type === 'alert' ? '/' : '/orders';

      if (record.user_id) {
        // Single user notification
        const { data: user } = await supabase
          .from('users')
          .select('push_token')
          .eq('id', record.user_id)
          .single();
        if (user?.push_token) {
          targetTokens.push(user.push_token);
        }
      } else {
        // Global broadcast
        const { data: users } = await supabase
          .from('users')
          .select('push_token')
          .not('push_token', 'is', null);
        if (users) {
          targetTokens = users.map(u => u.push_token).filter(Boolean);
        }
      }
    } else if ((table === 'orders' || table === 'blood_tests' || table === 'prescriptions') && event === 'UPDATE') {
      // Check if status changed
      if (record.status !== old_record.status) {
        const { data: user } = await supabase
          .from('users')
          .select('push_token')
          .eq('id', record.user_id)
          .single();

        if (user?.push_token) {
          targetTokens.push(user.push_token);
          
          if (table === 'orders') {
            const shortId = String(record.id).slice(0, 8).toUpperCase();
            title = `💊 Order #${shortId} Updated`;
            body = `Your order status is now: ${record.status.toUpperCase()}`;
            url = '/orders';
          } else if (table === 'blood_tests') {
            title = `🩸 Blood Test Update`;
            body = `Your booking for ${record.test_type} is now: ${record.status.toUpperCase()}`;
            url = '/orders';
          } else if (table === 'prescriptions') {
            title = `📋 Prescription Update`;
            body = `Your prescription status is now: ${record.status.toUpperCase()}`;
            url = '/prescriptions';
          }
        }
      }
    }

    if (targetTokens.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'No push tokens target found' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Send push notification to all target tokens
    const pushPromises = targetTokens.map(token => {
      const messagePayload = {
        message: {
          token,
          notification: { title, body },
          data: { url }
        }
      };

      return fetch(fcmUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(messagePayload)
      });
    });

    await Promise.all(pushPromises);

    return new Response(JSON.stringify({ success: true, dispatched: targetTokens.length }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in notify-user edge function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
