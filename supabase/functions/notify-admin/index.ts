import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { JWT } from 'https://esm.sh/google-auth-library@9';

serve(async (req) => {
  try {
    const payload = await req.json();

    // Check if it's an insert on the orders table
    if (payload.type !== 'INSERT' || payload.table !== 'orders') {
      return new Response('Not an order insert', { status: 200 });
    }

    const orderData = payload.record;

    // 1. Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Fetch the admin user's push token (assuming the admin has role='admin' or getting all tokens)
    // For simplicity, we just fetch all users who have a push_token. In a real app, filter where role = 'admin'.
    const { data: users, error } = await supabase
      .from('users')
      .select('push_token')
      .not('push_token', 'is', null);

    if (error || !users || users.length === 0) {
      console.log('No push tokens found');
      return new Response('No tokens found', { status: 200 });
    }

    // 3. Authenticate with Firebase HTTP v1 API
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

    // 4. Send Message to all tokens
    const pushPromises = users.map(user => {
      // Safely handle order ID (whether it's integer or UUID)
      const safeOrderId = String(orderData.id).slice(0, 8).toUpperCase();
      const amount = orderData.total_price || orderData.total_amount || 0;

      const messagePayload = {
        message: {
          token: user.push_token,
          notification: {
            title: `🏥 New Order Received! (₹${amount})`,
            body: `You have received a new medicine order #${safeOrderId}. Tap to view details.`,
          },
          data: {
            url: '/admin',
            orderId: String(orderData.id)
          }
        }
      };

      return fetch(`https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(messagePayload)
      });
    });

    await Promise.all(pushPromises);

    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Error in edge function:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
