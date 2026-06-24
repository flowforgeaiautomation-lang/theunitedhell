import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — The United Hell" },
      { name: "description", content: "Sign in to save stories, follow interests, and discuss." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "sign-up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Welcome to The United Hell.");
        navigate({ to: "/" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        navigate({ to: "/" });
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setBusy(true);
    try {
      const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (r.error) throw r.error instanceof Error ? r.error : new Error(String(r.error));
      if (!r.redirected) navigate({ to: "/" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-read py-16">
      <div className="text-center border-b rule pb-8 mb-10">
        <div className="kicker">{mode === "sign-in" ? "Welcome back" : "Begin reading"}</div>
        <h1 className="display-1 mt-3">
          {mode === "sign-in" ? "Sign in." : "Create an account."}
        </h1>
        <p className="dek mt-3 max-w-md mx-auto">
          Save stories, follow your interests, and join the discussion.
        </p>
      </div>

      <button
        onClick={onGoogle}
        disabled={busy}
        className="w-full border border-foreground py-3 mb-6 text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40"
      >
        Continue with Google
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 border-t rule" />
        <span className="kicker text-[0.65rem]">Or with email</span>
        <div className="flex-1 border-t rule" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "sign-up" && (
          <Field label="Name">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b-2 border-foreground/30 focus:border-foreground py-2 outline-none font-serif text-lg"
            />
          </Field>
        )}
        <Field label="Email">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b-2 border-foreground/30 focus:border-foreground py-2 outline-none font-serif text-lg"
          />
        </Field>
        <Field label="Password">
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b-2 border-foreground/30 focus:border-foreground py-2 outline-none font-serif text-lg"
          />
        </Field>
        <button
          type="submit"
          disabled={busy}
          className="w-full border border-foreground py-3 text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40"
        >
          {busy ? "…" : mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
      </form>

      <div className="text-center mt-6 text-sm">
        {mode === "sign-in" ? (
          <button onClick={() => setMode("sign-up")} className="kicker hover:opacity-60">
            New here? Create an account →
          </button>
        ) : (
          <button onClick={() => setMode("sign-in")} className="kicker hover:opacity-60">
            Already a reader? Sign in →
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="kicker">{label}</span>
      {children}
    </label>
  );
}
