CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.todos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  completed boolean NOT NULL DEFAULT false,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'personal' CHECK (
    category IN ('personal', 'work', 'shopping', 'health', 'learning', 'other')
  ),
  due_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS todos_set_updated_at ON public.todos;
CREATE TRIGGER todos_set_updated_at
BEFORE UPDATE ON public.todos
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP POLICY IF EXISTS "Public can view todos" ON public.todos;
DROP POLICY IF EXISTS "Public can insert todos" ON public.todos;
DROP POLICY IF EXISTS "Public can update todos" ON public.todos;
DROP POLICY IF EXISTS "Public can delete todos" ON public.todos;
DROP POLICY IF EXISTS "Users can view own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can insert own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can update own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can delete own todos" ON public.todos;

CREATE POLICY "Users can view own todos"
  ON public.todos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos"
  ON public.todos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos"
  ON public.todos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos"
  ON public.todos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS todos_created_at_idx
  ON public.todos (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_todos_user_created_at
  ON public.todos (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_todos_completed_created_at
  ON public.todos (completed, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_todos_priority_created_at
  ON public.todos (priority, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_todos_category_created_at
  ON public.todos (category, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_todos_title_trgm
  ON public.todos USING gin (title extensions.gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_todos_description_trgm
  ON public.todos USING gin (description extensions.gin_trgm_ops);
