import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "Men's Fashion", href: "/products?category=mens" },
    { label: "Women's Fashion", href: "/products?category=womens" },
    { label: "Jewelry", href: "/products?category=jewelry" },
    { label: "New Arrivals", href: "/products?new=true" },
    { label: "Sale", href: "/products?sale=true" },
  ],
  Help: [
    { label: "FAQs", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Track Order", href: "/orders" },
    { label: "Contact Us", href: "/contact" },
  ],
  Company: [
    { label: "About Clothio", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl font-semibold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-white/60 text-sm mb-6">
              Get the latest arrivals, exclusive offers, and style inspiration delivered to your inbox.
            </p>
            <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-sm placeholder:text-white/40 outline-none focus:border-[#e94560] transition-colors"
              />
              <button
                type="submit"
                className="bg-[#e94560] hover:bg-[#d63651] text-white font-medium text-sm px-5 py-2.5 rounded-full transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-3xl font-bold">
                Clot<span className="text-[#e94560]">hio</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Modern fashion for the bold and the free. Quality clothing and accessories
              that express your unique style.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-[#e94560]" />
                123 Fashion Ave, New York, NY 10001
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-[#e94560]" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-[#e94560]" />
                hello@clothio.com
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">{title}</h4>
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
              { icon: Facebook, href: "#", label: "Facebook" },
              { icon: Instagram, href: "#", label: "Instagram" },
              { icon: Twitter, href: "#", label: "Twitter" },
              { icon: Youtube, href: "#", label: "YouTube" },
            ].map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#e94560] flex items-center justify-center transition-colors"
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
    </footer>
  );
}