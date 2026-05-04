# Summarist Mobile Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three school-feedback items: burger menu on mobile, selected book responsive layout, Add to Library error handling.

**Architecture:** CSS-only change for responsive layout; state addition to Sidebar for drawer; try/catch addition to toggleSave in book detail page. No new dependencies, no new pages.

**Tech Stack:** Next.js 14, React, TypeScript, Firebase Firestore, CSS Modules (globals.css)

---

## Files Modified

- `src/components/layout/Sidebar.tsx` — add `isOpen` state, burger button, overlay backdrop
- `src/app/globals.css` — burger/overlay styles, sidebar--open override, selected book responsive
- `src/app/(app)/book/[id]/page.tsx` — try/catch in toggleSave, saveError state + display

---

### Task 1: Burger Menu — CSS

**Files:**
- Modify: `src/app/globals.css` (append to responsive overrides section at bottom)

- [ ] **Step 1: Add burger button and overlay CSS**

Find the final `@media (max-width: 576px)` block at the very end of `globals.css` and append the following AFTER it:

```css
/* BURGER BUTTON — mobile only */
.burger-btn {
  display: none;
  position: fixed;
  top: 14px;
  right: 16px;
  z-index: 200;
  background: #032b41;
  color: #fff;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  font-size: 20px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
}

/* SIDEBAR OVERLAY BACKDROP */
.sidebar__overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

/* SIDEBAR CLOSE BUTTON — inside drawer on mobile */
.sidebar__close {
  display: none;
  align-self: flex-end;
  margin: 0 16px 8px;
  background: transparent;
  border: none;
  font-size: 20px;
  color: #394547;
  cursor: pointer;
  line-height: 1;
}

@media (max-width: 768px) {
  .burger-btn {
    display: flex;
  }

  .sidebar--open {
    display: flex !important;
  }

  .sidebar__overlay--visible {
    display: block;
  }

  .sidebar__close {
    display: block;
  }
}
```

- [ ] **Step 2: Verify globals.css saved — no syntax errors**

Open the file, scroll to the bottom, confirm the new blocks are there and the file ends cleanly (no orphaned braces).

---

### Task 2: Burger Menu — Sidebar component

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Add isOpen state and wire up burger + overlay**

Replace the entire content of `Sidebar.tsx` with:

```tsx
"use client";

import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  async function handleSignOut() {
    await signOut(auth);
    dispatch(clearUser());
    router.push("/");
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      {/* Burger button — mobile only, shown via CSS */}
      <button className="burger-btn" onClick={() => setIsOpen(true)} aria-label="Open menu">
        ☰
      </button>

      {/* Overlay backdrop */}
      <div
        className={`sidebar__overlay${isOpen ? " sidebar__overlay--visible" : ""}`}
        onClick={close}
      />

      <div className={`sidebar${isOpen ? " sidebar--open" : ""}`}>
        <button className="sidebar__close" onClick={close} aria-label="Close menu">✕</button>

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
                  <Link href={href} className="sidebar__link" onClick={close}>
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
```

- [ ] **Step 2: Manual test — burger menu**

Run `npm run dev` in the project folder. Open browser at `http://localhost:3000/for-you` (log in first). Open DevTools → set width to 375px. Verify:
- `☰` button appears top-right
- Clicking it slides sidebar in from left with overlay
- Clicking overlay or `✕` closes it
- Clicking a nav link closes the drawer and navigates

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Sidebar.tsx src/app/globals.css
git commit -m "feat: add burger menu drawer for mobile nav"
```

---

### Task 3: Selected Book Responsive CSS

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add selected book responsive rule**

Find the `@media (max-width: 576px)` block in the RESPONSIVE OVERRIDES section at the bottom of `globals.css` (around line 1800). Add these rules inside that block, after the existing rules:

```css
  .selected__book--content {
    flex-direction: column;
    align-items: center;
  }

  .selected__book--image--mask {
    width: 120px;
    height: 120px;
  }

  .selected__book--text {
    text-align: center;
  }

  .selected__book--details--wrapper {
    justify-content: center;
  }
```

- [ ] **Step 2: Manual test — selected book on mobile**

In DevTools at 375px, navigate to `/for-you`. Verify:
- "Selected just for you" card shows image stacked above text (not side-by-side)
- Image is smaller (~120px)
- Text is centered
- No horizontal overflow on the card

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "fix: stack selected book card vertically on small screens"
```

---

### Task 4: Add to Library — Error Handling

**Files:**
- Modify: `src/app/(app)/book/[id]/page.tsx`

- [ ] **Step 1: Add saveError state and update toggleSave**

In `book/[id]/page.tsx`, find the existing state declarations (around line 20) and add `saveError`:

```tsx
const [saveError, setSaveError] = useState<string | null>(null);
```

Replace the existing `toggleSave` function with:

```tsx
async function toggleSave() {
  if (!user.uid || !book) return;
  setSaveError(null);
  const ref = doc(db, "users", user.uid, "savedBooks", book.id);
  try {
    if (saved) {
      await deleteDoc(ref);
      setSaved(false);
    } else {
      await setDoc(ref, book);
      setSaved(true);
    }
  } catch {
    setSaveError("Could not update library — please try again.");
  }
}
```

- [ ] **Step 2: Show error message in JSX**

Find the Add to Library button in the JSX:

```tsx
<button className="btn btn--secondary book-detail__btn" onClick={toggleSave}>
  {saved ? <BsBookmarkFill /> : <BsBookmark />}
  {saved ? "Saved" : "Add to Library"}
</button>
```

Add the error message immediately after that button:

```tsx
{saveError && (
  <div className="book-detail__save--error">{saveError}</div>
)}
```

- [ ] **Step 3: Add error style to globals.css**

Append to end of `globals.css`:

```css
.book-detail__save--error {
  color: #e53e3e;
  font-size: 13px;
  margin-top: 8px;
}
```

- [ ] **Step 4: Manual test — Add to Library**

At 375px in DevTools, open any book detail page while logged in. Click "Add to Library". Verify:
- Button changes to "Saved" with filled bookmark icon
- Navigate to `/library` — book appears in the list
- Go back to book detail — button still shows "Saved" (Firestore read on mount)
- Click "Saved" to remove — button reverts to "Add to Library"
- Navigate to `/library` — book is gone

If the button doesn't change (stays at "Add to Library"), the Firestore write failed — the red error message will show the reason. In that case, check Firebase Console → Firestore → Rules and ensure writes to `users/{uid}/savedBooks/{bookId}` are allowed for authenticated users.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(app)/book/[id]/page.tsx" src/app/globals.css
git commit -m "fix: add error handling to Add to Library, surface Firestore failures"
```

---

### Task 5: Deploy

- [ ] **Step 1: Push to main**

```bash
git push origin main
```

- [ ] **Step 2: Verify Vercel deploy**

Open Vercel dashboard → summarist project → check deployment status. Once green, open the live URL on a real phone and verify all three fixes work on actual mobile hardware.

- [ ] **Step 3: Resubmit to school**

Resubmit the Summarist project link to FES after confirming the live site passes the three criteria.
