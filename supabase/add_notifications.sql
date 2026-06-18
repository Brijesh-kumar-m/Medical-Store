-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- NULL indicates global/broadcast notification
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT DEFAULT 'alert', -- 'alert', 'order', 'blood_test', 'prescription'
  metadata JSONB DEFAULT '{}'::jsonb,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS to align with setup sql
ALTER TABLE IF EXISTS public.notifications DISABLE ROW LEVEL SECURITY;

-- Enable Supabase Realtime publication for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
