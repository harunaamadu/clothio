"use client";

import { useState } from "react";
import { resendVerificationEmail } from "@/server/actions/auth.actions";

export function ResendButton({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");
  const [countdown, setCountdown] = useState(0);

  async function handleResend() {
    setState("loading");
    try {
      await resendVerificationEmail(email);
      setState("sent");
      setCountdown(60);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(interval); setState("idle"); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setState("idle");
    }
  }

  if (state === "sent" || countdown > 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Email sent! Resend in{" "}
        <span className="font-medium text-foreground">{countdown}s</span>
      </p>
    );
  }

  return (
    <button
      onClick={handleResend}
      disabled={state === "loading"}
      className="text-sm underline underline-offset-4 hover:text-primary transition-colors disabled:opacity-50"
    >
      {state === "loading" ? "Sending..." : "Resend verification email"}
    </button>
  );
}