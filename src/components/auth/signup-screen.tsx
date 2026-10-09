import {
  AuthSplit,
  LockIcon,
  TruckIcon,
  WarrantyIcon,
} from "@/components/auth/auth-split";
import { SignupForm } from "@/components/auth/signup-form";

export function SignupScreen() {
  return (
    <AuthSplit
      image="/images/auth/signup-panel.jpg"
      imageAlt="Brass dome lamp on a wooden side table"
      headline={
        <>
          Create
          <br />
          Your Account
        </>
      }
      description="Join thousands of happy customers and bring beautiful lighting into your home."
      features={[
        { label: "Free Shipping", icon: <TruckIcon /> },
        { label: "1 Year Warranty", icon: <WarrantyIcon /> },
        { label: "Secure Payment", icon: <LockIcon /> },
      ]}
    >
      <SignupForm />
    </AuthSplit>
  );
}
