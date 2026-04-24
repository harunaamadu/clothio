import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma/client";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase securely.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/checkout");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      addresses: {
        orderBy: {
          isDefault: "desc",
        },
      },
    },
  });

  return (
    <main className="relative h-full w-full">
      <CheckoutClient addresses={user?.addresses ?? []} />
    </main>
  );
}