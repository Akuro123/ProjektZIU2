DROP POLICY IF EXISTS "Public can view todos" ON public.todos;
DROP POLICY IF EXISTS "Public can insert todos" ON public.todos;
DROP POLICY IF EXISTS "Public can update todos" ON public.todos;
DROP POLICY IF EXISTS "Public can delete todos" ON public.todos;

CREATE POLICY "Public can view todos"
  ON public.todos
  FOR SELECT
  USING (true);

CREATE POLICY "Public can insert todos"
  ON public.todos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update todos"
  ON public.todos
  FOR UPDATE
  USING (true);

CREATE POLICY "Public can delete todos"
  ON public.todos
  FOR DELETE
  USING (true);
