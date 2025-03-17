
-- Create table for tracking reading activity
CREATE TABLE IF NOT EXISTS public.reading_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  activity_type TEXT NOT NULL DEFAULT 'check_in',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add index for faster querying
CREATE INDEX IF NOT EXISTS reading_activity_user_id_idx ON public.reading_activity(user_id);
CREATE INDEX IF NOT EXISTS reading_activity_date_idx ON public.reading_activity(activity_date);

-- Add constraint to prevent multiple check-ins on the same day
ALTER TABLE public.reading_activity ADD CONSTRAINT reading_activity_user_date_unique UNIQUE (user_id, activity_date);

-- Add RLS policies to ensure users can only access their own data
ALTER TABLE public.reading_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reading activity" ON public.reading_activity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading activity" ON public.reading_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading activity" ON public.reading_activity
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading activity" ON public.reading_activity
  FOR DELETE USING (auth.uid() = user_id);
