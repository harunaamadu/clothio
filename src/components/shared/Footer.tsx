"use client";

import Link from "next/link";
import { footerLinks } from "@/lib/constants";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "../ui/field";

export function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-100">
      <div className="layout">
        {/* Newsletter */}
        <div className="border-b border-white/10">
          <form className="py-12" onSubmit={(e) => e.preventDefault()}>
            <FieldSet className="max-w-2xl mx-auto text-center">
              <FieldLegend className="font-display text-2xl font-semibold mb-2">
                Subscribe to Our Newsletter
              </FieldLegend>
              <FieldDescription className="text-white/60 text-center text-sm mb-6">
                Get the latest arrivals, exclusive offers, and style inspiration
                delivered to your inbox.
              </FieldDescription>
              <FieldGroup>
                <Field className="grid gap-2 max-w-md mx-auto sm:grid-cols-[1fr_auto]">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="inline-flex bg-white/10 border border-white/20 px-4 py-6 text-sm placeholder:text-white/40 outline-none focus:border-border transition-colors"
                  />

                  <Button type="submit" className="text-sm p-6 shrink-0">
                    Subscribe
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </div>

        {/* Main footer */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-4">
                <span className="font-display text-3xl font-bold">
                  Cloth<span className="text-primary">io</span>
                </span>
              </Link>
              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
                Modern fashion for the bold and the free. Quality clothing and
                accessories that express your unique style.
              </p>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0 text-primary" />
                  123 Fashion Ave, New York, NY 10001
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0 text-primary" />
                  +1 (555) 123-4567
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0 text-primary" />
                  hello@clothio.com
                </div>
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-white/60 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} Clothio. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: FaFacebook, href: "#", label: "Facebook" },
                { icon: FaInstagram, href: "#", label: "Instagram" },
                { icon: FaTwitter, href: "#", label: "Twitter" },
                { icon: FaYoutube, href: "#", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <span>Visa</span>
              <span>·</span>
              <span>Mastercard</span>
              <span>·</span>
              <span>PayPal</span>
              <span>·</span>
              <span>Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
