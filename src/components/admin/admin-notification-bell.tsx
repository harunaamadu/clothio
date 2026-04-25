"use client";

import { useEffect, useState, useTransition } from "react";
import {
  getAdminNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/server/actions/admin.actions";
import Link from "next/link";
import { Bell } from "lucide-react";
import Image from "next/image";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  link: string | null;
  createdAt: Date;
};

export default function AdminNotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [, startTransition] = useTransition();

  const unread = notifications.filter((n) => !n.read).length;

  async function fetchNotifications() {
    const data = await getAdminNotifications();
    setNotifications(data as Notification[]);
  }

  // Poll every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    });
  }

  function handleMarkRead(id: string) {
    startTransition(async () => {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-8 h-8 flex items-center justify-center text-stone-400 hover:text-foreground transition-colors"
      >
        <Bell />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 w-80 bg-background border border-stone-300  shadow-2xl z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800">
              <p className="text-xs tracking-[0.4em] uppercase text-stone-400">
                Notifications {unread > 0 && `(${unread})`}
              </p>
              {unread > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[9px] tracking-[0.3em] uppercase text-stone-500 hover:text-primary transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-stone-300">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 flex flex-col w-full h-full items-center justify-center text-center">
                  <Image
                    src="/images/empty-notification.png"
                    alt="empty notification vector"
                    width={100}
                    height={100}
                    className="object-cover"
                  />

                  <p className="text-xs text-stone-400">
                    No notifications yet.
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 flex gap-3 ${!n.read ? "bg-green-600/10 text-stone-800" : "bg-background text-stone-500"}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-amber-400" : "bg-stone-700"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-green-600 mb-0.5">{n.title}</p>
                      <p className="text-sm leading-relaxed">
                        {n.body}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <p className="text-xs">
                          {new Date(n.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <div className="flex gap-2">
                          {n.link && (
                            <Link
                              href={n.link}
                              onClick={() => {
                                handleMarkRead(n.id);
                                setOpen(false);
                              }}
                              className="text-xs tracking-[0.2em] uppercase transition-colors"
                            >
                              View
                            </Link>
                          )}
                          {!n.read && (
                            <button
                              onClick={() => handleMarkRead(n.id)}
                              className="text-xs tracking-[0.2em] uppercase text-stone-600 hover:text-destructive transition-colors"
                            >
                              Dismiss
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
