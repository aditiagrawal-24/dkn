-- Allow deleting users even if they were document uploaders
-- Keep documents, but clear uploaded_by when uploader account is deleted
ALTER TABLE public.client_documents
  ALTER COLUMN uploaded_by DROP NOT NULL;

ALTER TABLE public.client_documents
  DROP CONSTRAINT IF EXISTS client_documents_uploaded_by_fkey;

ALTER TABLE public.client_documents
  ADD CONSTRAINT client_documents_uploaded_by_fkey
  FOREIGN KEY (uploaded_by)
  REFERENCES auth.users(id)
  ON DELETE SET NULL;