import { toast } from "sonner";

export const showToast = {
  // Cart toasts
  addedToCart: (name: string, size?: string | null, color?: string | null) => {
    toast.success("Added to bag", {
      description: `${name}${size ? ` — ${size}` : ""}${color ? ` / ${color}` : ""}`,
      duration: 3000,
    });
  },

  removedFromCart: (name: string) => {
    toast("Removed from bag", {
      description: name,
      duration: 2500,
    });
  },

  cartCleared: () => {
    toast("Bag cleared", {
      description: "All items have been removed",
      duration: 2500,
    });
  },

  // Auth toasts
  signedIn: (name?: string | null) => {
    toast.success("Welcome back", {
      description: name ? `Signed in as ${name}` : "You are now signed in",
      duration: 3000,
    });
  },

  signedOut: () => {
    toast("Signed out", {
      description: "You have been signed out successfully",
      duration: 2500,
    });
  },

  // Newsletter
  subscribed: (email: string) => {
    toast.success("You're on the list", {
      description: `Welcome to The Edit — ${email}`,
      duration: 4000,
    });
  },

  // Generic
  error: (message: string) => {
    toast.error("Something went wrong", {
      description: message,
      duration: 4000,
    });
  },

  couponApplied: (code: string, discount: number) => {
    toast.success(`${discount}% discount applied`, {
      description: `Code ${code} is active on your order`,
      duration: 3000,
    });
  },

  couponInvalid: () => {
    toast.error("Invalid coupon", {
      description: "This code doesn't exist or has expired",
      duration: 3000,
    });
  },

  registered: (name?: string) => {
    toast.success("Account created", {
      description: name
        ? `Welcome to ${process.env.WEBSITE_NAME}, ${name}`
        : "Your account has been created",
      duration: 4000,
    });
  },
};
