"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CreditCardIcon,
  Location01Icon,
  ShoppingBag01Icon,
  Loading03Icon,
  PlusSignIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { useCartStore, useCartSubtotal } from "@/store/cart.store";
import { addressSchema, type AddressInput } from "@/schemas/checkout";
import { addAddressAction } from "@/server/actions/settings.actions";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Title from "../ui/title";
import SimpleTitle from "../ui/simpleTitle";
import type { z } from "zod";

interface CheckoutClientProps {
  addresses: {
    id: string;
    name: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
}

type Step = "address" | "payment";

export function CheckoutClient({
  addresses: initialAddresses,
}: CheckoutClientProps) {
  const subtotal = useCartSubtotal();
  const { items } = useCartStore();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedId, setSelectedId] = useState(
    initialAddresses.find((a) => a.isDefault)?.id ??
      initialAddresses[0]?.id ??
      "",
  );
  const [showNewAddress, setShowNewAddress] = useState(
    initialAddresses.length === 0,
  );
  const [step, setStep] = useState<Step>("address");
  const [saving, startSave] = useTransition();

  const shippingCost = subtotal >= 55 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const [redirecting, setRedirecting] = useState(false);

  const handleStripeCheckout = async () => {
    setRedirecting(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddressId: selectedId,
        }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err: any) {
      toast.error(err.message ?? "Failed to start checkout");
      setRedirecting(false);
    }
  };

  // Derive both input and output types from the schema
  type AddressFormInput = z.input<typeof addressSchema>;
  type AddressFormOutput = z.output<typeof addressSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormInput, unknown, AddressFormOutput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: "US",
    },
  });

  const onSaveAddress = (data: AddressFormOutput) =>
    startSave(async () => {
      const res = await addAddressAction(data);
      if (res.success) {
        toast.success("Address saved");
        const newAddr = {
          ...data,
          id: res.data.id,
          isDefault: addresses.length === 0,
        };
        setAddresses((prev) => [...prev, newAddr]);
        setSelectedId(res.data.id);
        setShowNewAddress(false);
        reset();
      } else {
        toast.error(res.error);
      }
    });

  /* ── Empty cart ── */
  if (items.length === 0) {
    return (
      <div className="layout py-24 text-center space-y-5">
        <HugeiconsIcon
          icon={ShoppingBag01Icon}
          size={48}
          className="text-muted-foreground mx-auto"
        />
        <p className="font-display text-xl font-bold text-foreground">
          Your cart is empty
        </p>
        <Link
          href="/products"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="layout py-8 md:py-12 w-full h-full">
      <Title
        eyebrow="Adress"
        title="Checkout"
        href="/shop"
        label="Go to Shop"
      />

      {/* Step tabs */}
      <div className="flex items-center gap-0 mb-10 border-b border-border">
        {(["address", "payment"] as Step[]).map((s, i) => (
          <button
            key={s}
            onClick={() =>
              s === "address" && step === "payment" && setStep("address")
            }
            className={cn(
              "flex items-center gap-2.5 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
              step === s
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "w-5 h-5 flex items-center justify-center text-xs font-bold border",
                step === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border",
              )}
            >
              {i + 1}
            </span>
            {s === "address" ? "Shipping" : "Payment"}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* ── Left: step content ── */}
        <div className="space-y-6">
          {/* STEP 1 — Shipping address */}
          {step === "address" && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 font-semibold text-foreground">
                <HugeiconsIcon icon={Location01Icon} size={16} /> Shipping
                Address
              </h2>

              {/* Saved addresses */}
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={cn(
                    "flex gap-3 p-4 border cursor-pointer transition-colors",
                    selectedId === addr.id
                      ? "border-foreground bg-muted"
                      : "border-border hover:border-muted-foreground",
                  )}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedId === addr.id}
                    onChange={() => {
                      setSelectedId(addr.id);
                      setShowNewAddress(false);
                    }}
                    className="mt-0.5 accent-foreground"
                  />
                  <div className="text-sm space-y-0.5">
                    <p className="font-medium text-foreground">{addr.name}</p>
                    <p className="text-muted-foreground">
                      {addr.line1}
                      {addr.line2 ? `, ${addr.line2}` : ""}
                    </p>
                    <p className="text-muted-foreground">
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p className="text-muted-foreground">{addr.country}</p>
                    {addr.isDefault && (
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wide text-primary mt-1">
                        Default
                      </span>
                    )}
                  </div>
                </label>
              ))}

              {/* Add new address toggle */}
              <button
                onClick={() => setShowNewAddress((v) => !v)}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
              >
                <HugeiconsIcon icon={PlusSignIcon} size={14} />
                {showNewAddress ? "Cancel" : "Add new address"}
              </button>

              {/* New address form */}
              {showNewAddress && (
                <form
                  onSubmit={handleSubmit(onSaveAddress)}
                  className="border border-border/50 p-5 space-y-3 bg-muted/30"
                >
                  <h3 className="font-medium text-sm text-foreground">
                    New address
                  </h3>
                  {[
                    {
                      name: "name" as const,
                      label: "Full name",
                      ph: "Jane Smith",
                    },
                    {
                      name: "line1" as const,
                      label: "Address",
                      ph: "123 Main St",
                    },
                    {
                      name: "line2" as const,
                      label: "Apt / Suite",
                      ph: "Optional",
                    },
                    { name: "city" as const, label: "City", ph: "New York" },
                    { name: "state" as const, label: "State", ph: "NY" },
                    {
                      name: "postalCode" as const,
                      label: "Postal code",
                      ph: "10001",
                    },
                    { name: "country" as const, label: "Country", ph: "US" },
                  ].map(({ name, label, ph }) => (
                    <div key={name} className="space-y-1">
                      <label className="text-xs font-medium text-foreground">
                        {label}
                      </label>
                      <input
                        {...register(name)}
                        placeholder={ph}
                        className={cn(
                          "w-full border px-3 py-2 text-sm outline-none transition-colors bg-background",
                          "placeholder:text-muted-foreground focus:border-foreground",
                          errors[name] ? "border-destructive" : "border-border",
                        )}
                      />
                      {errors[name] && (
                        <p className="text-xs text-destructive">
                          {errors[name]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 hover:opacity-90 disabled:opacity-60 transition-opacity"
                  >
                    {saving && (
                      <HugeiconsIcon
                        icon={Loading03Icon}
                        size={14}
                        className="animate-spin"
                      />
                    )}
                    Save address
                  </button>
                </form>
              )}

              <button
                onClick={() => selectedId && setStep("payment")}
                disabled={!selectedId}
                className="w-full bg-primary text-primary-foreground font-semibold py-3.5 text-sm hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* STEP 2 — Payment */}
          {step === "payment" && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 font-semibold text-foreground">
                <HugeiconsIcon icon={CreditCardIcon} size={16} /> Payment
              </h2>
              <p className="text-sm text-muted-foreground">
                You'll be redirected to Stripe's secure checkout to complete
                payment.
              </p>
              <button
                onClick={handleStripeCheckout}
                disabled={redirecting}
                className="w-full bg-primary text-primary-foreground font-semibold py-3.5 text-sm hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
              >
                {redirecting && (
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    size={16}
                    className="animate-spin"
                  />
                )}
                {redirecting ? "Redirecting..." : "Pay with Stripe"}
              </button>
            </div>
          )}
        </div>

        {/* ── Order summary sidebar ── */}
        <div className="border border-border p-5 space-y-4 bg-card sticky top-24">
          <SimpleTitle title="Order Summary" />

          {/* Item list */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="relative w-12 h-14 overflow-hidden bg-muted shrink-0">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground line-clamp-1">
                    {item.name}
                  </p>
                  {(item.size || item.color) && (
                    <p className="text-[10px] text-muted-foreground">
                      {[item.color, item.size].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <p className="text-xs font-semibold text-foreground shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>
                {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (8%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-foreground border-t border-border pt-3">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
