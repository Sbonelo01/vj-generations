import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin sign in — VJ Generation" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/admin" });
    });
  }, [nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You can sign in now.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav({ to: "/admin" });
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md p-8 rounded-2xl bg-card border border-border">
        <div className="text-center mb-6">
          <div className="text-gold uppercase text-xs tracking-[0.4em]">Admin</div>
          <h1 className="text-3xl font-bold mt-2">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-secondary border border-border rounded-lg outline-none focus:border-gold" />
          <input required type="password" placeholder="Password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-secondary border border-border rounded-lg outline-none focus:border-gold" />
          <button disabled={busy} className="w-full py-3 rounded-full text-primary-foreground font-semibold disabled:opacity-50"
            style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full mt-4 text-sm text-muted-foreground hover:text-gold">
          {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
        </button>
        <p className="text-xs text-muted-foreground text-center mt-6">Admin access is granted by the site owner after sign-up.</p>
      </div>
    </div>
  );
}