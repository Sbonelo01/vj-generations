import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, Check, X, Trash2, LogOut, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchGallery } from "@/lib/gallery";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — VJ Generation" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Submission = {
  id: string;
  storage_path: string;
  submitter_name: string;
  submitter_email: string | null;
  caption: string | null;
  status: string;
  created_at: string;
  url?: string | null;
};

function AdminPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user.id ?? null;
      setUserId(uid);
      if (!uid) {
        setIsAdmin(false);
        return;
      }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin");
      setIsAdmin((roles?.length ?? 0) > 0);
    });
  }, []);

  if (userId === undefined) return <div className="p-20 text-center text-muted-foreground">Loading…</div>;
  if (!userId) {
    return (
      <div className="p-20 text-center">
        <p className="mb-4 text-muted-foreground">Please sign in to access admin.</p>
        <Link to="/auth" className="text-gold hover:underline">Go to sign in →</Link>
      </div>
    );
  }
  if (isAdmin === false) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 text-center">
        <ShieldAlert className="mx-auto text-gold mb-4" size={40} />
        <h1 className="text-2xl font-bold mb-2">Not an admin yet</h1>
        <p className="text-muted-foreground mb-4">Your account exists but hasn't been granted admin access. Share your user ID with the site owner:</p>
        <code className="block p-3 rounded bg-secondary border border-border text-xs break-all">{userId}</code>
        <p className="text-xs text-muted-foreground mt-4">The owner can grant access by adding a row in <code>user_roles</code> with role <code>admin</code>.</p>
        <button onClick={async () => { await supabase.auth.signOut(); nav({ to: "/auth" }); }}
          className="mt-6 inline-flex items-center gap-2 text-muted-foreground hover:text-gold">
          <LogOut size={14} /> Sign out
        </button>
      </div>
    );
  }

  return <AdminDashboard onSignOut={async () => { await supabase.auth.signOut(); qc.clear(); nav({ to: "/" }); }} />;
}

function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"upload" | "submissions" | "gallery">("upload");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="text-gold uppercase text-xs tracking-[0.4em]">Admin</div>
          <h1 className="text-3xl font-bold">Studio dashboard</h1>
        </div>
        <button onClick={onSignOut} className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold text-sm">
          <LogOut size={14} /> Sign out
        </button>
      </div>

      <div className="flex gap-2 mb-8 border-b border-border">
        {(["upload", "submissions", "gallery"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm capitalize border-b-2 transition ${tab === t ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "upload" && <UploadPanel onDone={() => qc.invalidateQueries({ queryKey: ["gallery"] })} />}
      {tab === "submissions" && <SubmissionsPanel />}
      {tab === "gallery" && <ManageGallery />}
    </div>
  );
}

function UploadPanel({ onDone }: { onDone: () => void }) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [busy, setBusy] = useState(false);

  async function upload() {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `gallery/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("gallery").upload(path, file, { contentType: file.type });
        if (upErr) throw upErr;
        const { data: sess } = await supabase.auth.getUser();
        const { error: insErr } = await supabase.from("gallery_images").insert({
          storage_path: path,
          caption: caption.trim() || null,
          category: category.trim() || null,
          uploaded_by: sess.user?.id,
        });
        if (insErr) throw insErr;
      }
      toast.success(`Uploaded ${files.length} image(s).`);
      setFiles(null); setCaption(""); setCategory("");
      onDone();
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally { setBusy(false); }
  }

  return (
    <div className="p-8 rounded-2xl bg-card border border-border max-w-2xl space-y-4">
      <h2 className="text-xl font-semibold">Upload to gallery</h2>
      <input placeholder="Category (e.g. Weddings)" value={category} onChange={(e) => setCategory(e.target.value)}
        className="w-full p-3 bg-secondary border border-border rounded-lg outline-none focus:border-gold" />
      <input placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)}
        className="w-full p-3 bg-secondary border border-border rounded-lg outline-none focus:border-gold" />
      <label className="flex flex-col items-center gap-2 border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-gold">
        <Upload className="text-gold" />
        <span className="text-sm text-muted-foreground">{files?.length ? `${files.length} file(s) selected` : "Choose one or more images"}</span>
        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => setFiles(e.target.files)} />
      </label>
      <button disabled={busy || !files?.length} onClick={upload}
        className="w-full py-3 rounded-full text-primary-foreground font-semibold disabled:opacity-50"
        style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}>
        {busy ? "Uploading…" : "Upload to gallery"}
      </button>
    </div>
  );
}

function useSubmissions() {
  return useQuery({
    queryKey: ["submissions"],
    queryFn: async (): Promise<Submission[]> => {
      const { data, error } = await supabase.from("user_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      const rows = (data ?? []) as Submission[];
      if (rows.length === 0) return [];
      const { data: signed } = await supabase.storage.from("gallery").createSignedUrls(rows.map((r) => r.storage_path), 3600);
      return rows.map((r, i) => ({ ...r, url: signed?.[i]?.signedUrl }));
    },
  });
}

function SubmissionsPanel() {
  const qc = useQueryClient();
  const { data, isLoading } = useSubmissions();

  async function approve(s: Submission) {
    // Copy the storage object into a gallery/ path, then insert into gallery_images.
    try {
      const ext = s.storage_path.split(".").pop() || "jpg";
      const newPath = `gallery/${crypto.randomUUID()}.${ext}`;
      const { error: copyErr } = await supabase.storage.from("gallery").copy(s.storage_path, newPath);
      if (copyErr) throw copyErr;
      const { error: insErr } = await supabase.from("gallery_images").insert({
        storage_path: newPath,
        caption: s.caption ? `${s.caption} — ${s.submitter_name}` : `Shared by ${s.submitter_name}`,
        category: "Community",
      });
      if (insErr) throw insErr;
      const { error: updErr } = await supabase.from("user_submissions").update({ status: "approved", reviewed_at: new Date().toISOString() }).eq("id", s.id);
      if (updErr) throw updErr;
      toast.success("Approved & added to gallery.");
      qc.invalidateQueries({ queryKey: ["submissions"] });
      qc.invalidateQueries({ queryKey: ["gallery"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Approve failed");
    }
  }

  async function reject(s: Submission) {
    try {
      await supabase.storage.from("gallery").remove([s.storage_path]);
      await supabase.from("user_submissions").update({ status: "rejected", reviewed_at: new Date().toISOString() }).eq("id", s.id);
      toast.success("Submission rejected.");
      qc.invalidateQueries({ queryKey: ["submissions"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Reject failed");
    }
  }

  if (isLoading) return <p className="text-muted-foreground">Loading submissions…</p>;
  if (!data?.length) return <p className="text-muted-foreground">No submissions yet.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.map((s) => (
        <div key={s.id} className="p-4 rounded-2xl bg-card border border-border">
          {s.url && <img src={s.url} alt="" className="w-full aspect-video object-cover rounded mb-3" />}
          <div className="text-sm font-medium">{s.submitter_name}</div>
          <div className="text-xs text-muted-foreground">{s.submitter_email ?? "no email"} · {new Date(s.created_at).toLocaleDateString()}</div>
          {s.caption && <p className="text-sm mt-2 text-muted-foreground">{s.caption}</p>}
          <div className="mt-2 text-xs uppercase tracking-widest">
            Status: <span className={s.status === "pending" ? "text-gold" : "text-muted-foreground"}>{s.status}</span>
          </div>
          {s.status === "pending" && (
            <div className="flex gap-2 mt-4">
              <button onClick={() => approve(s)} className="flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-full bg-gold text-primary-foreground text-sm font-semibold">
                <Check size={14} /> Approve
              </button>
              <button onClick={() => reject(s)} className="flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-full border border-border text-sm hover:border-destructive hover:text-destructive">
                <X size={14} /> Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ManageGallery() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["gallery"], queryFn: fetchGallery });

  async function del(id: string, path: string) {
    if (!confirm("Remove this image from the gallery?")) return;
    try {
      await supabase.from("gallery_images").delete().eq("id", id);
      await supabase.storage.from("gallery").remove([path]);
      toast.success("Removed.");
      qc.invalidateQueries({ queryKey: ["gallery"] });
    } catch (e: any) { toast.error(e?.message ?? "Delete failed"); }
  }

  if (isLoading) return <p className="text-muted-foreground">Loading gallery…</p>;
  if (!data?.length) return <p className="text-muted-foreground">Gallery is empty.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {data.map((img) => (
        <div key={img.id} className="relative frame-gold aspect-square overflow-hidden group">
          <img src={img.url} alt="" className="w-full h-full object-cover" />
          <button onClick={() => del(img.id, img.storage_path)}
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur border border-border opacity-0 group-hover:opacity-100 hover:text-destructive z-10">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}