type StatusConfig = { label: string; color: string; dot: string; step: number };

export const statusConfig: Record<string, StatusConfig> = {
  PENDING:   { label: "Pending",   color: "text-amber-600",  dot: "bg-amber-400",  step: 1 },
  CONFIRMED: { label: "Confirmed", color: "text-blue-600",   dot: "bg-blue-400",   step: 2 },
  SHIPPED:   { label: "Shipped",   color: "text-violet-600", dot: "bg-violet-400", step: 3 },
  DELIVERED: { label: "Delivered", color: "text-green-600",  dot: "bg-green-400",  step: 4 },
  CANCELLED: { label: "Cancelled", color: "text-red-500",    dot: "bg-red-400",    step: 0 },
};

export const orderSteps = ["Pending", "Confirmed", "Shipped", "Delivered"];