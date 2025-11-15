import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Married Next",
  description: "Create your account to start building your wedding website",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
            card: "shadow-lg",
          },
        }}
        routing="path"
        path="/register"
        signInUrl="/sign-in"
        forceRedirectUrl="/engaged"
      />
    </div>
  );
}
