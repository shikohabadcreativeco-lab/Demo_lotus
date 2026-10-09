import type { Metadata } from "next";
import { LoginScreen } from "@/components/auth/login-screen";

export const metadata: Metadata = {
  title: "Sign in | Lotus Lights",
};

export default function LoginPage() {
  return <LoginScreen />;
}
