import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, Radar, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flight Price Notifier — 機票降價通知 from Saigon" },
      { name: "description", content: "Set a route and a target price — we email you when the fare from Ho Chi Minh City drops." },
      { property: "og:title", content: "Flight Price Notifier — 機票降價通知" },
      { property: "og:description", content: "設定航線與目標價，機票降價就通知你。Fare alerts for flights from Saigon." },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Radar, title: "盯緊熱門航線", en: "Always-on route watching", body: "持續監控胡志明市出發的熱門航線（香港、台北、北京、首爾），自動抓最低票價。" },
  { icon: BellRing, title: "達標自動通知", en: "Target-price email alerts", body: "低於你設定的目標價，就寄 email 提醒你，附上立即訂購連結。" },
  { icon: XCircle, title: "隨時取消", en: "Cancel anytime", body: "月訂閱制，不想用隨時停，沒有綁約。" },
];

const routes = ["SGN → HKG", "SGN → TPE", "SGN → PEK", "SGN → ICN"];

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <Button asChild variant="glow" size="sm">
          <Link to="/auth">Sign in / 登入</Link>
        </Button>
      </header>

      <main className="relative">
        <section className="mx-auto max-w-4xl px-6 pb-24 pt-20 text-center sm:pt-28">
          <p className="mx-auto mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" /> Saigon · 機票降價通知
          </p>
          <h1 className="animate-fade-up text-5xl font-bold tracking-tight sm:text-7xl" style={{ animationDelay: "80ms" }}>
            <span className="text-gradient">Flight Price</span>
            <br />
            Notifier
          </h1>
          <p className="mt-8 animate-fade-up text-xl font-medium sm:text-2xl" style={{ animationDelay: "160ms" }}>
            設定航線與目標價，機票降價就通知你
          </p>
          <p className="mx-auto mt-3 max-w-xl animate-fade-up text-muted-foreground" style={{ animationDelay: "220ms" }}>
            Set a route and a target price — we email you when the fare drops.
          </p>
          <div className="mt-10 flex animate-fade-up flex-wrap justify-center gap-2" style={{ animationDelay: "300ms" }}>
            {routes.map((r) => (
              <span key={r} className="rounded-md border border-border bg-card/60 px-3 py-1.5 font-mono text-xs text-muted-foreground">
                {r}
              </span>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-28">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <article className="h-full rounded-2xl border border-border bg-card/70 p-7 backdrop-blur transition-colors hover:border-primary/50">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
                    <f.icon className="h-5 w-5 text-primary-glow" />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm text-primary-glow">{f.en}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-muted-foreground">
          © 2026 Saigon Flight Price Notifier
        </div>
      </footer>
    </div>
  );
}
