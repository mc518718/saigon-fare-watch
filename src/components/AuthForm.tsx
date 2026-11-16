import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/app" },
        });
        if (error) throw error;
        if (!data.session) {
          setInfo("帳號已建立，請到信箱確認後再登入。Check your email to confirm.");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <header className="relative mx-auto flex w-full max-w-6xl items-center px-6 py-5">
        <Logo />
      </header>
      <main className="relative flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm animate-fade-up rounded-2xl border border-border bg-card/80 p-8 shadow-glow backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isSignup ? "建立帳號 Sign up" : "登入 Sign in"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSignup ? "開始追蹤機票價格。" : "歡迎回來。Welcome back."}
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密碼 Password</Label>
              <Input id="password" type="password" autoComplete={isSignup ? "new-password" : "current-password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {info && <p className="text-sm text-primary-glow">{info}</p>}
            <Button type="submit" variant="glow" className="w-full" disabled={loading}>
              {loading ? "…" : isSignup ? "建立帳號 Create account" : "登入 Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? (
              <>已有帳號？ <Link to="/auth" className="text-primary-glow hover:underline">Sign in</Link></>
            ) : (
              <>還沒有帳號？ <Link to="/signup" className="text-primary-glow hover:underline">Sign up</Link></>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}
