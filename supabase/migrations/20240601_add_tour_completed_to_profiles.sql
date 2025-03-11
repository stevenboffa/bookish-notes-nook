
-- Add tour_completed field to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS tour_completed BOOLEAN DEFAULT FALSE;

-- Update existing profiles to have tour_completed set to true
-- so they don't get the tour unless they explicitly request it
UPDATE profiles
SET tour_completed = TRUE
WHERE tour_completed IS NULL;
