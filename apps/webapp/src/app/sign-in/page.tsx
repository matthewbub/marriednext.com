import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import "../engaged/admin-global.css";

export const metadata: Metadata = {
  title: "Sign In - Married Next",
  description: "Sign in to your account to manage your wedding website",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
            card: "shadow-lg",
          },
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/register"
        forceRedirectUrl="/engaged"
      />
    </div>
  );
}
