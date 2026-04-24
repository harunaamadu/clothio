"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import Reveal from "../animations/reveal";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationDiamondIcon } from "@hugeicons/core-free-icons";

const subscriptionOptions = [
  { id: "marketing", label: "New arrivals & exclusive offers" },
  { id: "orders", label: "Order updates & shipping alerts" },
  { id: "reviews", label: "Product reviews & style tips" },
];

const Newsletter = () => {
  const [preferences, setPreferences] = useState<string[]>(["marketing"]);

  const togglePreference = (value: string) => {
    setPreferences((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  return (
    <section className="bg-stone-800 text-stone-100">
      <div className="layout border-y border-white/10 grid md:grid-cols-2">
        <Reveal>
          <div
            className="hidden md:block min-h-80 md:min-h-full bg-cover bg-center bg-no-repeat border border-border/20 z-10"
            style={{
              backgroundImage: "url('/assets/nl/newsletter.jpg')",
            }}
            data-reveal
          />
        </Reveal>

        <Reveal>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="py-16 px-6 sm:px-10 lg:px-14"
            data-reveal
          >
            <FieldSet className="max-w-2xl mx-auto text-center space-y-8">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-white/40 md:text-start">
                  Stay Updated
                </p>

                <FieldLegend className="font-heading text-3xl! sm:text-4xl! md:text-start font-semibold">
                  Join Our Newsletter
                </FieldLegend>

                <FieldDescription className="max-w-xl mx-auto text-sm sm:text-base text-white/60 text-center md:text-start leading-relaxed">
                  Choose the updates you want and receive only the content that
                  matters to you.
                </FieldDescription>
              </div>

              <FieldGroup className="space-y-6">
                <Field className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="h-14 border border-white/15 bg-white/5 px-5 text-sm text-white placeholder:text-white/35 focus:border-white/40 transition-colors"
                  />

                  <Button
                    type="submit"
                    variant={`secondary`}
                    className="h-14 px-8 text-sm font-medium tracking-wide uppercase"
                  >
                    Subscribe
                  </Button>
                </Field>

                <div className="grid gap-4 text-left">
                  {subscriptionOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <Checkbox
                        checked={preferences.includes(option.id)}
                        onCheckedChange={() => togglePreference(option.id)}
                      />
                      <span className="text-sm text-white/75">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </FieldGroup>

              <p className="flex items-center justify-center gap-1 text-xs text-white/35">
                <HugeiconsIcon
                  icon={InformationDiamondIcon}
                  size={10}
                  color="currentColor"
                  strokeWidth={1.5}
                />
                You can update your email preferences at any time.
              </p>
            </FieldSet>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default Newsletter;
