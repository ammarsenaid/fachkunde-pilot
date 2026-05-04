// Extract text per page from a PDF stored in the pdf-sources bucket.
// Triggered by the admin client with { document_id }.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
// @ts-ignore - Deno-friendly build of pdfjs
import * as pdfjsLib from "https://esm.sh/pdfjs-serverless@0.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing authorization" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Validate the caller and check admin role
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userRes, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userRes?.user) {
      return json({ error: "Unauthorized" }, 401);
    }
    const userId = userRes.user.id;

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) {
      return json({ error: "Forbidden — admin only" }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const documentId = body?.document_id as string | undefined;
    if (!documentId) {
      return json({ error: "document_id is required" }, 400);
    }

    const { data: doc, error: docErr } = await admin
      .from("pdf_documents")
      .select("id, storage_path, status")
      .eq("id", documentId)
      .single();

    if (docErr || !doc) {
      return json({ error: "Document not found" }, 404);
    }

    await admin
      .from("pdf_documents")
      .update({ status: "processing", error_message: null })
      .eq("id", documentId);

    const { data: file, error: dlErr } = await admin.storage
      .from("pdf-sources")
      .download(doc.storage_path);

    if (dlErr || !file) {
      await admin
        .from("pdf_documents")
        .update({ status: "failed", error_message: dlErr?.message ?? "download failed" })
        .eq("id", documentId);
      return json({ error: "Failed to download PDF" }, 500);
    }

    const buf = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjsLib.getDocument({ data: buf, useSystemFonts: true }).promise;
    const numPages = pdf.numPages;

    // Clear existing pages for idempotency
    await admin.from("pdf_pages").delete().eq("document_id", documentId);

    const rows: { document_id: string; page_number: number; content: string }[] = [];
    for (let p = 1; p <= numPages; p++) {
      const page = await pdf.getPage(p);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((it: any) => ("str" in it ? it.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      rows.push({ document_id: documentId, page_number: p, content: text });
    }

    // Insert in chunks to avoid payload limits
    const chunkSize = 50;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const slice = rows.slice(i, i + chunkSize);
      const { error: insErr } = await admin.from("pdf_pages").insert(slice);
      if (insErr) {
        await admin
          .from("pdf_documents")
          .update({ status: "failed", error_message: insErr.message })
          .eq("id", documentId);
        return json({ error: insErr.message }, 500);
      }
    }

    await admin
      .from("pdf_documents")
      .update({ status: "ready", page_count: numPages })
      .eq("id", documentId);

    return json({ ok: true, page_count: numPages });
  } catch (e) {
    console.error("extract-pdf error", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
