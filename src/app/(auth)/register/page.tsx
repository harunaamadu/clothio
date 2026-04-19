import Link from "next/link";
import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Sign Up" };

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-10">
        <h3 className="text-3xl font-semibold tracking-tight mb-2">
          Create an account
        </h3>
        <p className="text-sm text-muted-foregroun">
          Join{" "}
          <span className="font-semibold text-primary">
            {process.env.WEBSITE_NAME}
          </span>{" "}
          today and start exploring our exclusive collection!
        </p>
      </div>

      {/* Error banner (NextAuth error param) */}
      {searchParams.error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {searchParams.error === "CredentialsSignin"
            ? "Invalid email or password. Please try again."
            : "Something went wrong. Please try again."}
        </div>
      )}

      <RegisterForm />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
