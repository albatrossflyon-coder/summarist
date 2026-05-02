# Summarist

A Blinkist-style book summary app built as part of the Frontend Simplified Virtual Internship (v2).

**Live:** https://summarist-alpha.vercel.app

## Tech Stack

- Next.js 16 + TypeScript
- Firebase (Authentication + Firestore)
- Stripe (subscription payments)
- Redux Toolkit
- Vercel

## Features

- Auth modal — register, login, guest login
- For You page — selected, recommended, and suggested books
- Book detail — read/listen, premium lock, add to library
- Audio player — play/pause, ±10s skip, scrubber
- Search — debounced 300ms full-text search
- Choose Plan — monthly + annual Stripe subscriptions with 7-day free trial
- Library — saved books via Firestore
- Settings — subscription status, upgrade flow

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env.local` file with your Firebase and Stripe credentials (see `.env.example`).

## Environment Variables

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=
NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID=
```
