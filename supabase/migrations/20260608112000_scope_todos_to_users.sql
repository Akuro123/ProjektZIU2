ALTER TABLE public.todos
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_todos_user_created_at
  ON public.todos (user_id, created_at DESC);

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
