# Summarist Mobile Fixes — Design Spec
Date: 2026-05-04

## Context
School feedback on Advanced Virtual Internship requires three fixes before resubmission.

## Fix 1 — Burger Menu (Mobile Nav Drawer)

**Problem:** Sidebar is hidden on mobile (`display: none`) and replaced by a bottom nav. Instructor wants a burger menu for nav items.

**Solution:** Add a hamburger button (visible only on mobile ≤768px) that toggles the sidebar as a left-side drawer overlay.

- `isOpen` state added to `Sidebar.tsx`
- Burger button: fixed position, top-right on mobile, shows `☰` / `✕`
- Sidebar gets `sidebar--open` class when `isOpen` is true, overriding `display: none` on mobile
- Dark overlay backdrop rendered behind open sidebar; clicking it closes the drawer
- Bottom nav stays for quick access

**Files:** `components/layout/Sidebar.tsx`, `app/globals.css`

## Fix 2 — "Just For You" Selected Book Responsive

**Problem:** `.selected__book--content` is a flex-row with a fixed 140px image. On 375px screens, text area is cramped and layout breaks.

**Solution:** At ≤576px, switch to `flex-column`, shrink image to 120px centered. No JSX changes — CSS only.

**Files:** `app/globals.css`

## Fix 3 — Add to Library → Library Page

**Problem:** `toggleSave()` has no error handling. If Firestore write fails (rules or network), it fails silently and the book never appears in Library.

**Solution:**
- Wrap `setDoc`/`deleteDoc` in try/catch
- Show inline error state if save fails
- Confirm Library page re-fetches on mount (already does via `useEffect` on `user.uid`) — no change needed there

**Files:** `app/(app)/book/[id]/page.tsx`

## Out of Scope
- No new pages, no new dependencies
- Highlights and Help nav items remain disabled (per original spec)
