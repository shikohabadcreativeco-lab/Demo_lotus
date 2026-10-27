import { AdminLoginScreen } from "@/components/auth/admin-login-screen";
import {
  AuthSplit,
  DesignIcon,
  PeopleIcon,
  ShieldIcon,
} from "@/components/auth/auth-split";
import { LoginForm } from "@/components/auth/login-form";

export function LoginScreen({ nextPath = "/" }: { nextPath?: string }) {
  if (nextPath.startsWith("/admin")) {
    return <AdminLoginScreen nextPath={nextPath} />;
  }

  return (
    <AuthSplit
      image="/images/auth/login-panel.jpg"
      imageAlt="Circular ring lamp glowing on a wooden table"
      headline={
        <>
          Light Up
          <br />
          a Better
          <br />
          Tomorrow
        </>
      }
      description="Premium lighting solutions designed to bring warmth, style and sophistication to your space."
      features={[
        { label: "Premium Quality", icon: <ShieldIcon /> },
        { label: "Modern Design", icon: <DesignIcon /> },
        { label: "Trusted by Thousands", icon: <PeopleIcon /> },
      ]}
    >
      <LoginForm nextPath={nextPath} />
    </AuthSplit>
  );
}
