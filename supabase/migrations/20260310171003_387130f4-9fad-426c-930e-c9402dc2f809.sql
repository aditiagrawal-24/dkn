
-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Admins can manage all documents" ON public.client_documents;
DROP POLICY IF EXISTS "Clients can view own documents" ON public.client_documents;

-- Permissive: admin full access
CREATE POLICY "Admins can manage all documents"
ON public.client_documents
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Permissive: clients see only their own docs
CREATE POLICY "Clients can view own documents"
ON public.client_documents
FOR SELECT
TO authenticated
USING (client_id = auth.uid());
