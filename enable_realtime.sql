-- =============================================
-- Enable Supabase Realtime for admin notifications
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Enable realtime for prescriptions table
ALTER PUBLICATION supabase_realtime ADD TABLE prescriptions;

-- Enable realtime for blood_tests table
ALTER PUBLICATION supabase_realtime ADD TABLE blood_tests;

-- Verify: You can check which tables have realtime enabled
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
