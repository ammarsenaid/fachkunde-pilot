import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type PdfStatus = "uploaded" | "processing" | "ready" | "failed";

export interface PdfDocument {
  id: string;
  filename: string;
  storage_path: string;
  page_count: number;
  status: PdfStatus;
  error_message: string | null;
  created_at: string;
}

export interface PdfPage {
  id: string;
  document_id: string;
  page_number: number;
  content: string;
}

export interface ContentMapping {
  id: string;
  document_id: string;
  page_id: string | null;
  module_id: string;
  subtopic_id: string | null;
  title: string | null;
  chunk_text: string;
  position: number;
  created_at: string;
}

export function usePdfDocuments() {
  const [documents, setDocuments] = useState<PdfDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pdf_documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Konnte Dokumente nicht laden");
    } else {
      setDocuments((data ?? []) as PdfDocument[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const uploadPdf = useCallback(
    async (file: File) => {
      const { data: session } = await supabase.auth.getUser();
      const userId = session.user?.id;
      if (!userId) {
        toast.error("Nicht angemeldet");
        return null;
      }

      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${userId}/${Date.now()}_${safe}`;

      const { error: upErr } = await supabase.storage
        .from("pdf-sources")
        .upload(path, file, { contentType: "application/pdf" });
      if (upErr) {
        toast.error(`Upload fehlgeschlagen: ${upErr.message}`);
        return null;
      }

      const { data: doc, error: insErr } = await supabase
        .from("pdf_documents")
        .insert({
          filename: file.name,
          storage_path: path,
          uploaded_by: userId,
          status: "uploaded",
        })
        .select()
        .single();

      if (insErr || !doc) {
        toast.error(`Konnte Dokument nicht speichern: ${insErr?.message}`);
        return null;
      }

      toast.success("PDF hochgeladen — Text wird extrahiert…");
      // Fire and forget extraction
      supabase.functions
        .invoke("extract-pdf", { body: { document_id: doc.id } })
        .then(({ error }) => {
          if (error) {
            toast.error(`Extraktion fehlgeschlagen: ${error.message}`);
          } else {
            toast.success("PDF-Text extrahiert");
          }
          refresh();
        });

      await refresh();
      return doc as PdfDocument;
    },
    [refresh]
  );

  const removeDocument = useCallback(
    async (doc: PdfDocument) => {
      await supabase.storage.from("pdf-sources").remove([doc.storage_path]);
      const { error } = await supabase.from("pdf_documents").delete().eq("id", doc.id);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Dokument gelöscht");
      refresh();
    },
    [refresh]
  );

  const reprocess = useCallback(
    async (doc: PdfDocument) => {
      toast.info("Extraktion gestartet…");
      const { error } = await supabase.functions.invoke("extract-pdf", {
        body: { document_id: doc.id },
      });
      if (error) toast.error(error.message);
      else toast.success("Extraktion abgeschlossen");
      refresh();
    },
    [refresh]
  );

  return { documents, loading, refresh, uploadPdf, removeDocument, reprocess };
}

export function usePdfPages(documentId: string | null) {
  const [pages, setPages] = useState<PdfPage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!documentId) {
      setPages([]);
      return;
    }
    setLoading(true);
    supabase
      .from("pdf_pages")
      .select("*")
      .eq("document_id", documentId)
      .order("page_number", { ascending: true })
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        else setPages((data ?? []) as PdfPage[]);
        setLoading(false);
      });
  }, [documentId]);

  return { pages, loading };
}

export function useContentMappings(documentId: string | null) {
  const [mappings, setMappings] = useState<ContentMapping[]>([]);

  const refresh = useCallback(async () => {
    if (!documentId) {
      setMappings([]);
      return;
    }
    const { data, error } = await supabase
      .from("content_mappings")
      .select("*")
      .eq("document_id", documentId)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setMappings((data ?? []) as ContentMapping[]);
  }, [documentId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: {
      document_id: string;
      page_id: string | null;
      module_id: string;
      subtopic_id: string | null;
      title: string | null;
      chunk_text: string;
    }) => {
      const { data: session } = await supabase.auth.getUser();
      const userId = session.user?.id;
      if (!userId) return;
      const { error } = await supabase
        .from("content_mappings")
        .insert({ ...input, created_by: userId });
      if (error) toast.error(error.message);
      else {
        toast.success("Inhalt zugewiesen");
        refresh();
      }
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("content_mappings").delete().eq("id", id);
      if (error) toast.error(error.message);
      else refresh();
    },
    [refresh]
  );

  return { mappings, refresh, create, remove };
}
