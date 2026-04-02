-- Run this in Supabase SQL editor or via the Supabase CLI
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS resend_contact_id   text,
  ADD COLUMN IF NOT EXISTS resend_email_2_id   text,
  ADD COLUMN IF NOT EXISTS resend_email_3_id   text,
  ADD COLUMN IF NOT EXISTS call_booked_at      timestamptz;
