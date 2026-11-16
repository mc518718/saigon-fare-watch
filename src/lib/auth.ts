import { redirect } from "react-router";

import { supabase } from "@/integrations/supabase/client";

export const AUTHENTICATED_ROUTE_ID = "authenticated";

// Client-only gate for protected pages: no signed-in user -> /auth.
export async function requireUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw redirect("/auth");
  return { user: data.user };
}

export type AuthenticatedData = Awaited<ReturnType<typeof requireUser>>;
