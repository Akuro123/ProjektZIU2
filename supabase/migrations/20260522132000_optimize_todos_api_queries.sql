DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'todos_category_check'
      AND conrelid = 'public.todos'::regclass
  ) THEN
    ALTER TABLE public.todos
      ADD CONSTRAINT todos_category_check
      CHECK (category IN ('personal', 'work', 'shopping', 'health', 'learning', 'other'))
      NOT VALID;
  END IF;
END;
$$;

ALTER TABLE public.todos VALIDATE CONSTRAINT todos_category_check;

CREATE INDEX IF NOT EXISTS idx_todos_completed_created_at
  ON public.todos (completed, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_todos_priority_created_at
  ON public.todos (priority, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_todos_category_created_at
  ON public.todos (category, created_at DESC);

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

CREATE INDEX IF NOT EXISTS idx_todos_title_trgm
  ON public.todos USING gin (title extensions.gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_todos_description_trgm
  ON public.todos USING gin (description extensions.gin_trgm_ops);
