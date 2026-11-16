import { AuthForm } from "@/components/AuthForm";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function SignUp() {
  usePageMeta({
    title: "Sign up — Flight Price Notifier",
    description: "Create a Flight Price Notifier account and get emailed when fares drop.",
    ogDescription: "Create an account and get alerts when Saigon fares drop.",
  });
  return <AuthForm mode="signup" />;
}
