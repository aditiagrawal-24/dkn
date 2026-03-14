
-- Create roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'client');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles: users can read their own roles, admins can read all
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create documents table
CREATE TABLE public.client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  category TEXT NOT NULL DEFAULT 'General',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;

-- Clients can only see their own documents
CREATE POLICY "Clients can view own documents" ON public.client_documents
  FOR SELECT TO authenticated
  USING (client_id = auth.uid());

-- Admins can do everything
CREATE POLICY "Admins can manage all documents" ON public.client_documents
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for client documents
INSERT INTO storage.buckets (id, name, public) VALUES ('client-documents', 'client-documents', false);

-- Storage policies: admins can upload, clients can read their own files
CREATE POLICY "Admins can upload documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'client-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all files" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'client-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can read own documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'client-documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Profiles table for user display names
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
