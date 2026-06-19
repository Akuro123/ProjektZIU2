
CREATE TABLE public.todos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view todos" ON public.todos FOR SELECT USING (true);
CREATE POLICY "Public can insert todos" ON public.todos FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update todos" ON public.todos FOR UPDATE USING (true);
CREATE POLICY "Public can delete todos" ON public.todos FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER todos_set_updated_at
BEFORE UPDATE ON public.todos
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX todos_created_at_idx ON public.todos (created_at DESC);
