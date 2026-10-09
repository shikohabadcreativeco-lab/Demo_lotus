import type { Metadata } from "next";
import { SignupScreen } from "@/components/auth/signup-screen";

export const metadata: Metadata = {
  title: "Create an account | Lotus Lights",
};

export default function SignupPage() {
  return <SignupScreen />;
}
