"use client";

import Link from "next/link";
import { footerLinks } from "@/lib/constants";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import SimpleTitle from "../ui/simpleTitle";
import { BrandDirectoryItem } from "@/types";
import Reveal from "../animations/reveal";

export const brandDirectory: BrandDirectoryItem[] = [
  {
    category: "Fashion",
    items: [
      "T-Shirt",
      "Shirts",
      "Shorts & Jeans",
      "Jacket",
      "Dress & Frock",
      "Innerwear",
      "Hosiery",
    ],
  },
  {
    category: "Footwear",
    items: [
      "Sport",
      "Formal",
      "Boots",
      "Casual",
      "Cowboy Shoes",
      "Safety Shoes",
      "Party Wear Shoes",
      "Branded",
      "Firstcopy",
      "Long Shoes",
    ],
  },
  {
    category: "Jewellery",
    items: [
      "Necklace",
      "Earrings",
      "Couple Rings",
      "Pendants",
      "Crystal",
      "Bangles",
      "Bracelets",
      "Nosepin",
      "Chain",
    ],
  },
  {
    category: "Cosmetics",
    items: [
      "Shampoo",
      "Bodywash",
      "Facewash",
      "Makeup Kit",
      "Liner",
      "Lipstick",
      "Perfume",
      "Body Soap",
      "Scrub",
      "Hair Gel",
      "Hair Colors",
      "Hair Dye",
      "Sunscreen",
      "Skin Lotion",
    ],
  },
];

export function Footer() {
  return (
    <>
      <footer className="bg-stone-100 text-stone-700">
        <div className="layout border-b">
          <div className="py-12">
            <SimpleTitle title="Brand Directory" />

            <Reveal stagger={0.75}>
              {brandDirectory.map((section) => (
                <div
                  key={section.category}
                  className="flex flex-wrap gap-2 tracking-wide leading-normal not-last:mb-4"
                  data-reveal
                >
                  <span className="font-semibold uppercase">
                    {section.category}:
                  </span>

                  {section.items.map((item, index) => (
                    <Link
                      key={item}
                      href={item}
                      className="hover:text-primary transition-colors"
                    >
                      {item}
                      {index !== section.items.length - 1 && " | "}
                    </Link>
                  ))}
                </div>
              ))}
            </Reveal>
          </div>
        </div>

        <div className="layout">
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

                <p className="text-stone-700 text-sm leading-relaxed mb-6 max-w-xs">
                  Modern fashion for the bold and the free. Quality clothing and
                  accessories that express your unique style.
                </p>

                <div className="grid md:grid-cols-2 gap-4 items-center mb-4">
                  <div className="block p-2 bg-stone-300 text-center">
                    <h3 className="font-medium text-lg">Playstore App</h3>
                    <p className="font-light text-xs opacity-80">Coming soon</p>
                  </div>

                  <div className="block p-2 bg-stone-800 text-white text-center">
                    <h3 className="font-medium text-lg">AppStore App</h3>
                    <p className="font-light text-xs opacity-80">Coming soon</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-stone-600">
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
                          className="text-stone-600 hover:text-primary text-sm transition-colors"
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
          <div className="border-t border-border/10">
            <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-600">
              <p className="text-xs">
                ©{new Date().getFullYear()}{" "}
                <em className="font-semibold text-stone-900">
                  {process.env.WEBSITE_NAME || "Clothio"}
                </em>
                . All rights reserved.
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
                    className="w-8 h-8 bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs">
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

      <p className="p-4 text-center text-sm text-muted-foreground">
        <span className="font-semibold text-primary">
          {process.env.NEXT_PUBLIC_WEBSITE_NAME}
        </span>{" "}
        — Designed &amp; developed by{" "}
        <a
          href="https://www.facebook.com/harunaamadu95"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary transition-colors hover:underline hover:text-primary/80"
        >
          Haruna Amadu
        </a>{" "}
        using Next.js &amp; shadcn/ui
      </p>
    </>
  );
}
