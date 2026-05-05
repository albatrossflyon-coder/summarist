"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillHome } from "react-icons/ai";
import { BsBookmarkFill } from "react-icons/bs";
import { BiSearch, BiCog } from "react-icons/bi";

const bottomNavItems = [
  { href: "/for-you", icon: AiFillHome, label: "Home" },
  { href: "/search", icon: BiSearch, label: "Search" },
  { href: "/library", icon: BsBookmarkFill, label: "Library" },
  { href: "/settings", icon: BiCog, label: "Settings" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {bottomNavItems.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={`bottom-nav__item${pathname === href ? " bottom-nav__item--active" : ""}`}
        >
          <Icon className="bottom-nav__icon" />
          <span className="bottom-nav__label">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
