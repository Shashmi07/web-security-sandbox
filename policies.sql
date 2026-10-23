
-- 1. Enable Row Level Security
ALTER TABLE public.leads
ENABLE ROW LEVEL SECURITY;

-- 2. Remove existing policies for this exercise, if present
DROP POLICY IF EXISTS "Users can read own leads"
ON public.leads;

DROP POLICY IF EXISTS "Users can insert own leads"
ON public.leads;

DROP POLICY IF EXISTS "Users can update own leads"
ON public.leads;

DROP POLICY IF EXISTS "Users can delete own leads"
ON public.leads;

-- 3. Remove direct table permissions from anon
REVOKE ALL ON TABLE public.leads FROM anon;

-- 4. Allow authenticated users to perform these operations
GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.leads TO authenticated;

-- 5. SELECT: Read only your own leads
CREATE POLICY "Users can read own leads"
ON public.leads
FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

-- 6. INSERT: Create leads only for yourself
CREATE POLICY "Users can insert own leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- 7. UPDATE: Update only your own leads
CREATE POLICY "Users can update own leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- 8. DELETE: Delete only your own leads
CREATE POLICY "Users can delete own leads"
ON public.leads
FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);
