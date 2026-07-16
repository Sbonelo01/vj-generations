import { supabase } from "@/integrations/supabase/client";

export type GalleryImage = {
  id: string;
  storage_path: string;
  caption: string | null;
  category: string | null;
  created_at: string;
};

export async function fetchGallery(): Promise<(GalleryImage & { url: string })[]> {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("id, storage_path, caption, category, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as GalleryImage[];
  if (rows.length === 0) return [];
  const paths = rows.map((r) => r.storage_path);
  const { data: signed, error: signErr } = await supabase.storage
    .from("gallery")
    .createSignedUrls(paths, 60 * 60);
  if (signErr) throw signErr;
  return rows.map((r, i) => ({ ...r, url: signed?.[i]?.signedUrl ?? "" }));
}