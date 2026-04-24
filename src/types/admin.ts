import type { OrderStatus } from "@/generated/prisma/enums";

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders: {
    id: string;
    status: OrderStatus;
    total: number;
    createdAt: Date;
    user: {
      name: string | null;
      email: string;
    };
  }[];
}