// Client for the flight-api (AWS API Gateway -> Lambda -> DynamoDB).
// The browser holds no AWS credentials: it only calls these two public endpoints.
// Note: the API trusts the email it is given (no JWT check yet) — acceptable for
// this milestone; production should verify the signed-in session server-side.

const DEFAULT_API_URL = "https://yzhvxxi481.execute-api.us-east-1.amazonaws.com";

export const FLIGHT_API_URL = (
  (import.meta.env["VITE_FLIGHT_API_URL"] as string | undefined) || DEFAULT_API_URL
).replace(/\/+$/, "");

export type PlanName = "tokyo" | "seoul";

export type Plan = {
  name: PlanName;
  label: string;
  labelEn: string;
  origin: string;
  destination: string;
  route: string;
};

export const PLANS: Plan[] = [
  {
    name: "tokyo",
    label: "台北 ✈ 東京",
    labelEn: "Taipei to Tokyo",
    origin: "TPE",
    destination: "TYO",
    route: "TPE-TYO",
  },
  {
    name: "seoul",
    label: "台北 ✈ 首爾",
    labelEn: "Taipei to Seoul",
    origin: "TPE",
    destination: "SEL",
    route: "TPE-SEL",
  },
];

export type Subscription = {
  email: string;
  route: string;
  plan_name: PlanName;
  target_price: number;
  currency: string;
  updated_at?: string;
};

async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    if (body.error) return body.error;
  } catch {
    // fall through to the status text
  }
  return `Request failed (${res.status})`;
}

export function subscriptionsQueryKey(email: string) {
  return ["subscriptions", email] as const;
}

export async function listSubscriptions(email: string): Promise<Subscription[]> {
  const res = await fetch(`${FLIGHT_API_URL}/subscriptions?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error(await readError(res));
  const body = (await res.json()) as { subscriptions?: Subscription[] };
  return body.subscriptions ?? [];
}

export async function saveSubscription(input: {
  email: string;
  plan_name: PlanName;
  target_price: number;
}): Promise<Subscription> {
  const res = await fetch(`${FLIGHT_API_URL}/subscribe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as Subscription;
}
