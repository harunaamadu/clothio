import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  return (
    <div className="flex flex-col items-center px-8 py-12 bg-background">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <h3 className="text-3xl font-semibold tracking-tight mb-2">
            Welcome back
          </h3>
          <p className="text-sm text-muted-foreground">
            Sign in to your{" "}
            <span className="font-semibold text-primary">
              {process.env.WEBSITE_NAME}
            </span>{" "}
            account
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

        <LoginForm callbackUrl={searchParams.callbackUrl} />

        <div className="mt-6 text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Forgot your password?
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
