"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Hamburger / close button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-foreground/5"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          {open ? (
            <>
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </>
          ) : (
            <>
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </>
          )}
        </svg>
      </button>

      {/* Overlay + panel */}
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Slide-out panel */}
          <nav className="absolute top-0 left-0 flex h-full w-64 flex-col bg-background shadow-xl">
            {/* Panel header — same height as the site header */}
            <div className="flex h-16 shrink-0 items-center px-6">
              <span className="text-lg font-semibold text-foreground">
                Menu
              </span>
            </div>

            {/* Links */}
            <ul className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-foreground/5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
