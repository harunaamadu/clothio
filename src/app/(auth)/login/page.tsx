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
    <div className=" relative layout min-h-[calc(100vh-8rem)] grid md:grid-cols-2">
      <Link
        href="/"
        className="absolute top-6 right-6 text-base font-semibold text-primary hover:underline underline-offset-4 transition-colors"
      >
        {process.env.WEBSITE_NAME} |{" "}
        <span className="text-stone-400">Home</span>
      </Link>

      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between p-14 bg-stone-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/auth-bg.jpg')] bg-cover bg-center opacity-30" />
        <div className="relative z-10">
          <span className="text-xs tracking-[0.4em] uppercase text-stone-400">
            {process.env.WEBSITE_NAME} — Est. 2025
          </span>
        </div>
        <div className="relative z-10">
          <h2 className="text-5xl font-light leading-tight text-stone-800">
            Style is a way
            <br />
            to say who you
            <br />
            are without
            <br />
            speaking.
          </h2>
          <p className="mt-6 text-sm text-stone-400 tracking-wide">
            — Rachel Zoe
          </p>
        </div>
        <div className="relative z-10 text-xs text-stone-400 tracking-wide">
          New arrivals every week. Free returns on all orders.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center px-8 py-16 bg-background">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h3 className="text-3xl font-semibold tracking-tight mb-2">
              Welcome back
            </h3>
            <p className="text-sm text-muted-foregroun">
              Sign in to your{" "}
              <span className="font-semibold text-primary">
                {process.env.WEBSITE_NAME}
              </span>{" "}
              account
            </p>
          </div>

          {/* Error banner (NextAuth error param) */}
          {searchParams.error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
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
    </div>
  );
}
