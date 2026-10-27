import {
  AuthSplit,
  LockIcon,
  TruckIcon,
  WarrantyIcon,
} from "@/components/auth/auth-split";
import { SignupForm } from "@/components/auth/signup-form";

export function SignupScreen({ nextPath = "/" }: { nextPath?: string }) {
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
      description="Join customers who use Lotus Lights in homes, offices, showrooms, and stores."
      features={[
        { label: "Free Shipping", icon: <TruckIcon /> },
        { label: "1 Year Warranty", icon: <WarrantyIcon /> },
        { label: "Secure Payment", icon: <LockIcon /> },
      ]}
    >
      <SignupForm nextPath={nextPath} />
    </AuthSplit>
  );
}
