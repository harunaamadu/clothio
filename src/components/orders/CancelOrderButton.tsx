"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, XCircle } from "lucide-react"
import { cancelOrderAction } from "@/server/actions/order.actions"
import { toast } from "sonner"

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [pending, start] = useTransition()

  const handleCancel = () => {
    if (!confirm("Cancel this order? This cannot be undone.")) return
    start(async () => {
      const res = await cancelOrderAction(orderId)
      if (res.success) {
        toast.success("Order cancelled")
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <button
      onClick={handleCancel}
      disabled={pending}
      className="flex items-center gap-1.5 text-sm font-medium text-destructive border border-destructive/30 hover:border-destructive hover:bg-destructive/5 px-3 py-1.5 transition-colors disabled:opacity-50"
    >
      {pending
        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
        : <XCircle className="w-3.5 h-3.5" />
      }
      Cancel order
    </button>
  )
}