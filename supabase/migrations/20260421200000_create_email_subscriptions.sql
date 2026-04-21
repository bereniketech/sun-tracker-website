-- Create email_subscriptions table for monthly email reports
CREATE TABLE email_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  location_name TEXT NOT NULL,
  opted_in BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Create index for faster user lookups and opted_in queries
CREATE INDEX idx_email_subscriptions_user_id ON email_subscriptions(user_id);
CREATE INDEX idx_email_subscriptions_opted_in ON email_subscriptions(opted_in);
CREATE INDEX idx_email_subscriptions_created_at ON email_subscriptions(created_at);

-- Enable Row Level Security
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read/write their own subscriptions
CREATE POLICY "Users can read their own email subscriptions"
  ON email_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own email subscriptions"
  ON email_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email subscriptions"
  ON email_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email subscriptions"
  ON email_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a service role bypass policy for the Edge Function
CREATE POLICY "Service role can read all opted-in email subscriptions"
  ON email_subscriptions
  FOR SELECT
  USING (true);
