
DROP POLICY IF EXISTS "Public can view todos" ON public.todos;
DROP POLICY IF EXISTS "Public can insert todos" ON public.todos;
DROP POLICY IF EXISTS "Public can update todos" ON public.todos;
DROP POLICY IF EXISTS "Public can delete todos" ON public.todos;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
