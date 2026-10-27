import type { Metadata } from "next";
import { ForgotPasswordFlow } from "@/components/auth/forgot-password-flow";

export const metadata: Metadata = {
  title: "Forgot password | Lotus Lights",
  description: "Reset your Lotus Lights password with a verification code.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordFlow />;
}
