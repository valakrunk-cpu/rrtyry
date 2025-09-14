-- UDG V 5.0 Keys Database Schema
-- Run this in your Supabase SQL Editor

-- Create UDG Keys table
CREATE TABLE IF NOT EXISTS udg_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(17) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  max_usage INTEGER,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_by VARCHAR(255),
  notes TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_udg_keys_key ON udg_keys(key);
CREATE INDEX IF NOT EXISTS idx_udg_keys_active ON udg_keys(is_active);

-- Insert sample UDG V 5.0 keys for testing
INSERT INTO udg_keys (key, is_active, max_usage, created_by, notes) VALUES
('UDG-DEMO-TEST-0001', true, 100, 'system', 'Demo key for testing'),
('UDG-BETA-USER-0002', true, 50, 'system', 'Beta user key'),
('UDG-PREM-UNLM-0003', true, null, 'system', 'Premium unlimited key'),
('UDG-TRIAL-TEMP-0004', true, 10, 'system', 'Trial key with 10 uses'),
('UDG-ADMIN-FULL-0005', true, null, 'system', 'Admin full access key')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security (optional but recommended)
ALTER TABLE udg_keys ENABLE ROW LEVEL SECURITY;

-- Policy to allow reading active keys only
CREATE POLICY IF NOT EXISTS "Allow read active keys" ON udg_keys
  FOR SELECT USING (is_active = true);

-- Policy to allow updating usage count
CREATE POLICY IF NOT EXISTS "Allow usage updates" ON udg_keys
  FOR UPDATE USING (is_active = true);

-- View to check key statistics (optional)
CREATE OR REPLACE VIEW udg_key_stats AS
SELECT 
  COUNT(*) as total_keys,
  COUNT(*) FILTER (WHERE is_active = true) as active_keys,
  COUNT(*) FILTER (WHERE is_active = false) as inactive_keys,
  COUNT(*) FILTER (WHERE expires_at IS NOT NULL AND expires_at < NOW()) as expired_keys,
  SUM(usage_count) as total_usage
FROM udg_keys;