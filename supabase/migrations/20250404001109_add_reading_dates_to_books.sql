-- Add start_date and end_date columns to books table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'books' 
        AND column_name = 'start_date'
    ) THEN
        ALTER TABLE books ADD COLUMN start_date DATE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'books' 
        AND column_name = 'end_date'
    ) THEN
        ALTER TABLE books ADD COLUMN end_date DATE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'books' 
        AND column_name = 'last_summary_note_count'
    ) THEN
        ALTER TABLE books ADD COLUMN last_summary_note_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'static_book_recommendations' 
        AND policyname = 'Anyone can read recommendations'
    ) THEN
        DROP POLICY "Anyone can read recommendations" ON public.static_book_recommendations;
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'static_book_recommendations' 
        AND policyname = 'Service role can manage recommendations'
    ) THEN
        DROP POLICY "Service role can manage recommendations" ON public.static_book_recommendations;
    END IF;
END $$;

-- Recreate policies
CREATE POLICY "Anyone can read recommendations"
  ON public.static_book_recommendations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can manage recommendations"
  ON public.static_book_recommendations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);




