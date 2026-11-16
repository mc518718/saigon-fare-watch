import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getUser: () => getUser(),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: vi.fn(),
    },
  },
}));

import { routes } from "@/routes";

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

describe("App routing", () => {
  beforeEach(() => {
    getUser.mockResolvedValue({ data: { user: null }, error: null });
  });

  it("renders the landing page at /", async () => {
    renderAt("/");
    expect(await screen.findByText("設定航線與目標價，機票降價就通知你")).toBeInTheDocument();
  });

  it("renders sign-in at /auth", async () => {
    renderAt("/auth");
    expect(await screen.findByRole("heading", { name: "登入 Sign in" })).toBeInTheDocument();
  });

  it("redirects the /sign-in and /sign-up aliases", async () => {
    const router = renderAt("/sign-up");
    expect(await screen.findByRole("heading", { name: "建立帳號 Sign up" })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/signup");
  });

  it("redirects a signed-out deep link to /app back to sign-in", async () => {
    const router = renderAt("/app");
    expect(await screen.findByRole("heading", { name: "登入 Sign in" })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/auth");
  });

  it("shows the dashboard at /app for a signed-in user", async () => {
    getUser.mockResolvedValue({
      data: { user: { id: "1", email: "me@example.com" } },
      error: null,
    });
    renderAt("/app");
    expect(await screen.findByText("me@example.com")).toBeInTheDocument();
  });

  it("shows the 404 page for unknown paths", async () => {
    renderAt("/nope");
    expect(await screen.findByText("Page not found")).toBeInTheDocument();
  });
});
