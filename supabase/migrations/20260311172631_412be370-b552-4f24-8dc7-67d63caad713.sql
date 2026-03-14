
-- Guides & Downloads table
CREATE TABLE public.resources_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  tag text DEFAULT 'General',
  file_path text,
  file_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  sort_order int DEFAULT 0
);

ALTER TABLE public.resources_guides ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can view guides" ON public.resources_guides
  FOR SELECT TO anon, authenticated USING (true);

-- Admin manage
CREATE POLICY "Admins can manage guides" ON public.resources_guides
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Important Deadlines table
CREATE TABLE public.resources_deadlines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL,
  deadline_date text NOT NULL,
  status text DEFAULT 'upcoming',
  created_at timestamptz NOT NULL DEFAULT now(),
  sort_order int DEFAULT 0
);

ALTER TABLE public.resources_deadlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view deadlines" ON public.resources_deadlines
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage deadlines" ON public.resources_deadlines
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Useful Links table
CREATE TABLE public.resources_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL DEFAULT '#',
  created_at timestamptz NOT NULL DEFAULT now(),
  sort_order int DEFAULT 0
);

ALTER TABLE public.resources_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view links" ON public.resources_links
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage links" ON public.resources_links
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for resource guide files
INSERT INTO storage.buckets (id, name, public) VALUES ('resource-files', 'resource-files', true);

-- Storage policies for resource-files bucket
CREATE POLICY "Anyone can read resource files" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'resource-files');

CREATE POLICY "Admins can upload resource files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resource-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete resource files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'resource-files' AND public.has_role(auth.uid(), 'admin'));
