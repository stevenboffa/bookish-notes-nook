DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'books' 
        AND column_name = 'ai_summary'
    ) THEN
        ALTER TABLE books ADD COLUMN ai_summary JSONB;
    END IF;
END $$;




