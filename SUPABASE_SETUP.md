# UDG V 5.0 Supabase Integration Setup

## 1. Install Supabase Client
```bash
npm install @supabase/supabase-js
```

## 2. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy your project URL and anon key

## 3. Environment Variables
Create `.env` file in project root:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Database Schema
Run this SQL in Supabase SQL Editor:

```sql
-- Create UDG Keys table
CREATE TABLE udg_keys (
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
CREATE INDEX idx_udg_keys_key ON udg_keys(key);
CREATE INDEX idx_udg_keys_active ON udg_keys(is_active);

-- Insert sample keys for testing
INSERT INTO udg_keys (key, is_active, max_usage, created_by, notes) VALUES
('UDG-TEST-KEY1-0001', true, 100, 'admin', 'Test key 1'),
('UDG-TEST-KEY2-0002', true, 50, 'admin', 'Test key 2'),
('UDG-DEMO-KEY3-0003', true, null, 'admin', 'Unlimited demo key');
```

## 5. Row Level Security (Optional)
```sql
-- Enable RLS
ALTER TABLE udg_keys ENABLE ROW LEVEL SECURITY;

-- Allow read access to active keys only
CREATE POLICY "Allow read active keys" ON udg_keys
  FOR SELECT USING (is_active = true);

-- Allow update for usage tracking
CREATE POLICY "Allow usage updates" ON udg_keys
  FOR UPDATE USING (is_active = true);
```

## 6. Features Implemented
- ✅ Secure key validation against Supabase database
- ✅ Usage tracking and limits
- ✅ Key expiration support
- ✅ Real-time validation
- ✅ Error handling and user feedback
- ✅ No more random key generation

## 7. Key Management
Keys can be managed through:
- Supabase Dashboard (manual)
- Admin panel (future feature)
- API endpoints (future feature)

## 8. Security Features
- Keys stored securely in Supabase
- Usage limits and expiration
- Real-time validation
- Encrypted connections
- No client-side key generation