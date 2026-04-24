import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
  //   apiVersion: "2025-03-31.basil",
});
