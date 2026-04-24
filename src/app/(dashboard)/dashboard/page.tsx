"use client";

import { Badge } from "@/components/ui/badge";
import Title from "@/components/ui/title";
import { useSession } from "next-auth/react";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const DashboardPage = () => {
  const { data: session } = useSession();

  const userName = session?.user?.name?.split(" ")[0] || "there";

  const role = session?.user?.role?.toLowerCase();

  const greeting = getGreeting();

  return (
    <div className="layout py-24">
      {session?.user && (
        <div className="flex items-start justify-between gap-6">
          <Title
            title={`${greeting}, ${userName}!`}
            description="Welcome back to your dashboard. Here’s a quick overview of your activity and settings."
          />

          <p className="text-sm py-2 px-3 capitalize text-stone-400">{role}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
