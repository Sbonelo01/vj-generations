import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Share your photos — VJ Generation" },
      { name: "description", content: "Attended an event we covered? Submit your photos to be featured in the VJ Generation gallery." },
    ],
  }),
  component: SubmitPage,
});

function SubmitPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !name.trim()) {
      toast.error("Please add your name and a photo.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Please upload an image under 10MB.");
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `submissions/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("gallery").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (upErr) throw upErr;
      const { error: insErr } = await supabase.from("user_submissions").insert({
        storage_path: path,
        submitter_name: name.trim(),
        submitter_email: email.trim() || null,
        caption: caption.trim() || null,
      });
      if (insErr) throw insErr;
      setDone(true);
      toast.success("Thank you! Your photo is with our team.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center">
        <CheckCircle2 className="text-gold mx-auto mb-6" size={56} />
        <h1 className="text-3xl font-bold mb-3">Thank you!</h1>
        <p className="text-muted-foreground">Your photo has been received. Our team will review it, and if approved you'll see it in the gallery soon.</p>
        <button onClick={() => { setDone(false); setFile(null); setCaption(""); }} className="mt-8 text-gold hover:underline">Submit another →</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-10">
        <div className="text-gold uppercase text-xs tracking-[0.4em] mb-3">Community wall</div>
        <h1 className="text-4xl sm:text-5xl font-bold">Share your memory</h1>
        <p className="text-muted-foreground mt-3">Were you at one of our events? Send us your photo — we'd love to add it to our gallery.</p>
      </div>

      <form onSubmit={submit} className="p-8 rounded-2xl bg-card border border-border space-y-5">
        <Field label="Your name *">
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Jane Doe" />
        </Field>
        <Field label="Email (optional)">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="jane@example.com" />
        </Field>
        <Field label="Caption (optional)">
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} className="input resize-none" placeholder="Tell us about this moment…" />
        </Field>
        <Field label="Photo *">
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-gold transition">
            <Upload className="text-gold" />
            <span className="text-sm text-muted-foreground">{file ? file.name : "Tap to choose a photo (max 10MB)"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </Field>

        <button
          disabled={busy}
          className="w-full py-3 rounded-full text-primary-foreground font-semibold disabled:opacity-50"
          style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
        >
          {busy ? "Uploading…" : "Send to VJ Generation"}
        </button>
        <p className="text-xs text-muted-foreground text-center">Submissions are reviewed by our team before appearing on the site.</p>
      </form>

      <style>{`.input{width:100%;padding:.75rem 1rem;background:var(--secondary);border:1px solid var(--border);border-radius:.5rem;color:var(--foreground);outline:none;transition:border-color .2s}.input:focus{border-color:var(--gold)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">{label}</span>
      {children}
    </label>
  );
}