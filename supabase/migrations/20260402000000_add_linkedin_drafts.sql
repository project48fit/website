CREATE TABLE IF NOT EXISTS linkedin_drafts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz
);
