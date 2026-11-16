import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouteLoaderData } from "react-router";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { PlanCard } from "@/components/PlanCard";
import { usePageMeta } from "@/hooks/use-page-meta";
import { AUTHENTICATED_ROUTE_ID, type AuthenticatedData } from "@/lib/auth";
import { listSubscriptions, PLANS, subscriptionsQueryKey } from "@/lib/subscriptions";

export default function Dashboard() {
  usePageMeta({
    title: "Dashboard — Flight Price Notifier",
    description: "Your Flight Price Notifier dashboard.",
    ogDescription: "Your flight fare tracking dashboard.",
    robots: "noindex",
  });
  const { user } = useRouteLoaderData(AUTHENTICATED_ROUTE_ID) as AuthenticatedData;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const email = user.email ?? "";
  const subscriptions = useQuery({
    queryKey: subscriptionsQueryKey(email),
    queryFn: () => listSubscriptions(email),
    enabled: Boolean(email),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <header className="relative border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut /> Sign out / 登出
          </Button>
        </div>
      </header>
      <main className="relative mx-auto max-w-4xl px-6 py-16 animate-fade-up">
        <h1 className="break-all text-3xl font-semibold tracking-tight sm:text-4xl">
          Hi <span className="text-gradient">{user.email}</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          選一條航線、設定台幣目標價 — 票價達標時我們會寄信到這個信箱。
          <span className="block text-sm">
            Pick a route and a TWD target. We email you when the fare drops to it.
          </span>
        </p>
        {subscriptions.isError && (
          <p role="alert" className="mt-6 text-sm text-destructive">
            無法載入你的訂閱狀態，請重新整理再試。Couldn't load your subscriptions.
          </p>
        )}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              email={email}
              subscription={subscriptions.data?.find((s) => s.route === plan.route)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
