ALTER TABLE public.todos ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'personal';
CREATE INDEX IF NOT EXISTS idx_todos_category ON public.todos(category);