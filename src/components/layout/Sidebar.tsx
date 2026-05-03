"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AiFillHome } from "react-icons/ai";
import { BsBookmarkFill } from "react-icons/bs";
import { BiSearch, BiCog } from "react-icons/bi";
import { RiPencilLine, RiCustomerService2Line } from "react-icons/ri";
import { HiOutlineLogin } from "react-icons/hi";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/userSlice";

const navItems = [
  { href: "/for-you", icon: AiFillHome, label: "For You", disabled: false },
  { href: "/library", icon: BsBookmarkFill, label: "My Library", disabled: false },
  { href: "/highlights", icon: RiPencilLine, label: "Highlights", disabled: true },
  { href: "/search", icon: BiSearch, label: "Search", disabled: false },
  { href: "/settings", icon: BiCog, label: "Settings", disabled: false },
  { href: "/help", icon: RiCustomerService2Line, label: "Help & Support", disabled: true },
];

const bottomNavItems = [
  { href: "/for-you", icon: AiFillHome, label: "Home", disabled: false },
  { href: "/search", icon: BiSearch, label: "Search", disabled: false },
  { href: "/library", icon: BsBookmarkFill, label: "Library", disabled: false },
  { href: "/settings", icon: BiCog, label: "Settings", disabled: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  async function handleSignOut() {
    await signOut(auth);
    dispatch(clearUser());
    router.push("/");
  }

  return (
    <>
      <div className="sidebar">
        <div className="sidebar__logo--wrapper">
          <img src="/assets/logo.png" alt="logo" className="sidebar__logo" />
        </div>
        <nav>
          <ul className="sidebar__list">
            {navItems.map(({ href, icon: Icon, label, disabled }) => (
              <li
                key={href}
                className={`sidebar__item${pathname === href ? " sidebar__item--active" : ""}${disabled ? " sidebar__item--disabled" : ""}`}
              >
                {disabled ? (
                  <span className="sidebar__link sidebar__link--disabled">
                    <Icon className="sidebar__icon" />
                    <span>{label}</span>
                  </span>
                ) : (
                  <Link href={href} className="sidebar__link">
                    <Icon className="sidebar__icon" />
                    <span>{label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar__bottom">
          <button className="sidebar__link sidebar__link--btn" onClick={handleSignOut}>
            <HiOutlineLogin className="sidebar__icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <nav className="bottom-nav">
        {bottomNavItems.map(({ href, icon: Icon, label, disabled }) =>
          disabled ? (
            <span key={href} className="bottom-nav__item bottom-nav__item--disabled">
              <Icon className="bottom-nav__icon" />
              <span className="bottom-nav__label">{label}</span>
            </span>
          ) : (
            <Link
              key={href}
              href={href}
              className={`bottom-nav__item${pathname === href ? " bottom-nav__item--active" : ""}`}
            >
              <Icon className="bottom-nav__icon" />
              <span className="bottom-nav__label">{label}</span>
            </Link>
          )
        )}
      </nav>
    </>
  );
}
