import { Navigate, type RouteObject } from "react-router";

import { NotFound, RootError, RootLayout } from "@/components/RootLayout";
import { AUTHENTICATED_ROUTE_ID, requireUser } from "@/lib/auth";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RootError />,
    // Nothing is server-rendered, so there is nothing to show while the first loader runs.
    HydrateFallback: () => null,
    children: [
      { index: true, element: <Index /> },
      { path: "auth", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      // Friendly aliases for the auth pages.
      { path: "sign-in", element: <Navigate to="/auth" replace /> },
      { path: "sign-up", element: <Navigate to="/signup" replace /> },
      {
        id: AUTHENTICATED_ROUTE_ID,
        loader: requireUser,
        children: [{ path: "app", element: <Dashboard /> }],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];
