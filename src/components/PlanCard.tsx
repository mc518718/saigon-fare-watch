import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BellRing, Check, Plane } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  saveSubscription,
  subscriptionsQueryKey,
  type Plan,
  type Subscription,
} from "@/lib/subscriptions";

const twd = new Intl.NumberFormat("zh-TW");

export function PlanCard({
  plan,
  email,
  subscription,
}: {
  plan: Plan;
  email: string;
  subscription: Subscription | undefined;
}) {
  const queryClient = useQueryClient();
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const subscribed = Boolean(subscription);
  const inputId = `target-${plan.name}`;

  const mutation = useMutation({
    mutationFn: saveSubscription,
    onSuccess: (saved) => {
      // Flip the card to "subscribed" right away, then confirm against the API.
      queryClient.setQueryData<Subscription[]>(subscriptionsQueryKey(email), (old) => [
        ...(old ?? []).filter((s) => s.route !== saved.route),
        saved,
      ]);
      void queryClient.invalidateQueries({ queryKey: subscriptionsQueryKey(email) });
      setPrice("");
    },
  });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const value = Number(price);
    if (!price.trim() || !Number.isFinite(value) || value <= 0) {
      setError("請輸入大於 0 的目標價 / Enter a target price above 0.");
      return;
    }
    setError(null);
    mutation.mutate({ email, plan_name: plan.name, target_price: Math.round(value) });
  }

  const message = error ?? (mutation.isError ? `儲存失敗：${mutation.error.message}` : null);

  return (
    <section
      aria-label={plan.label}
      className="rounded-2xl border border-border bg-card/70 p-6 backdrop-blur"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
            <Plane className="h-5 w-5 text-primary-glow" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{plan.label}</h2>
            <p className="text-xs text-muted-foreground">
              {plan.labelEn} · {plan.route}
            </p>
          </div>
        </div>
        {subscribed && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary-glow">
            <Check className="h-3.5 w-3.5" /> 已訂閱
          </span>
        )}
      </div>

      {subscription && (
        <p className="mt-5 text-sm text-muted-foreground">
          目前目標價 Current target
          <span className="ml-2 text-xl font-semibold text-foreground">
            NT${twd.format(subscription.target_price)}
          </span>
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-5 space-y-3" noValidate>
        <Label htmlFor={inputId}>
          {subscribed ? "新的目標價 New target (TWD)" : "目標價 Target price (TWD)"}
        </Label>
        <div className="flex gap-2">
          <Input
            id={inputId}
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            placeholder="例如 8000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            aria-invalid={Boolean(message)}
            aria-describedby={message ? `${inputId}-msg` : undefined}
          />
          <Button
            type="submit"
            disabled={mutation.isPending}
            variant={subscribed ? "outline" : "default"}
            className="shrink-0"
          >
            <BellRing />
            {mutation.isPending ? "儲存中…" : subscribed ? "更新目標價" : "開始追蹤"}
          </Button>
        </div>
        {message && (
          <p id={`${inputId}-msg`} role="alert" className="text-sm text-destructive">
            {message}
          </p>
        )}
        {!message && mutation.isSuccess && (
          <p role="status" className="text-sm text-muted-foreground">
            已儲存 — 票價低於目標價時會寄信通知你。
          </p>
        )}
      </form>
    </section>
  );
}
