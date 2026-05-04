
-- Storage bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdf-sources', 'pdf-sources', false)
ON CONFLICT (id) DO NOTHING;

-- Admin-only storage policies on pdf-sources bucket
CREATE POLICY "Admins can read pdf-sources"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'pdf-sources' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload pdf-sources"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'pdf-sources' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pdf-sources"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'pdf-sources' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete pdf-sources"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'pdf-sources' AND public.has_role(auth.uid(), 'admin'));

-- pdf_documents
CREATE TYPE public.pdf_status AS ENUM ('uploaded', 'processing', 'ready', 'failed');

CREATE TABLE public.pdf_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  page_count integer NOT NULL DEFAULT 0,
  status public.pdf_status NOT NULL DEFAULT 'uploaded',
  error_message text,
  uploaded_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pdf_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage pdf_documents"
ON public.pdf_documents FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_pdf_documents_updated
BEFORE UPDATE ON public.pdf_documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- pdf_pages
CREATE TABLE public.pdf_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.pdf_documents(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (document_id, page_number)
);

CREATE INDEX idx_pdf_pages_doc ON public.pdf_pages(document_id, page_number);

ALTER TABLE public.pdf_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage pdf_pages"
ON public.pdf_pages FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- content_mappings (links extracted chunks to modules/subtopics)
CREATE TABLE public.content_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.pdf_documents(id) ON DELETE CASCADE,
  page_id uuid REFERENCES public.pdf_pages(id) ON DELETE SET NULL,
  module_id text NOT NULL,
  subtopic_id text,
  title text,
  chunk_text text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_content_mappings_module ON public.content_mappings(module_id, subtopic_id);
CREATE INDEX idx_content_mappings_doc ON public.content_mappings(document_id);

ALTER TABLE public.content_mappings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage content_mappings"
ON public.content_mappings FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_content_mappings_updated
BEFORE UPDATE ON public.content_mappings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
