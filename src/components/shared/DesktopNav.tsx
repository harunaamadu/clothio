"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { NavBackground } from "./NavBackground";
import { NavLink } from "./NavLink";
import { AnimatedNavButton } from "./AnimatedNavButton";
import { DropDownMenu } from "./DropDownMenu";

interface NavLinkItem {
  label: string;
  href: string;
  type?: "mega" | "dropdown" | "link";
  children?: { label: string; href: string }[];
}

interface DesktopNavProps {
  navLinks: NavLinkItem[];
  isCurrentPath: (href: string) => boolean;
  megaOpen: boolean;
  onToggleMega: () => void;
}

export function DesktopNav({
  navLinks,
  isCurrentPath,
  megaOpen,
  onToggleMega,
}: DesktopNavProps) {
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!itemsRef.current) return;

    gsap.fromTo(
      itemsRef.current.children,
      { opacity: 0, y: -6 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power3.out",
        stagger: 0.06,
        delay: 0.1,
        clearProps: "transform",
      }
    );
  }, []);

  return (
    <nav
      className="hidden md:flex items-center relative z-10"
      aria-label="Main navigation"
    >
      <NavBackground />

      <div ref={itemsRef} className="relative z-10 flex items-center gap-0.5">
        {navLinks.map((link) => {
          if (link.type === "mega") {
            return (
              <AnimatedNavButton
                key={link.label}
                label={link.label}
                isOpen={megaOpen}
                onClick={onToggleMega}
              />
            );
          }

          if (link.type === "dropdown" && link.children) {
            return (
              <DropDownMenu
                key={link.label}
                label={link.label}
                href={link.href}
                childrenLinks={link.children}
                isActive={isCurrentPath(link.href)}
              />
            );
          }

          return (
            <NavLink
              key={link.label}
              href={link.href}
              label={link.label}
              isActive={isCurrentPath(link.href)}
              isSale={link.label === "Sale"}
            />
          );
        })}
      </div>
    </nav>
  );
}