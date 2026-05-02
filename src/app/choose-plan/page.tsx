"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { BsCheckLg } from "react-icons/bs";

const PLANS = [
  {
    id: "premium-monthly",
    label: "Premium Monthly",
    price: "$9.99/month",
    description: "7-day free trial included",
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!,
    highlight: false,
  },
  {
    id: "premium-plus",
    label: "Premium Plus Yearly",
    price: "$99.99/year",
    description: "7-day free trial included · Save over 15%",
    priceId: process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID!,
    highlight: true,
  },
];

const FEATURES = [
  "Access to 1,500+ book summaries",
  "Key ideas in audio and text",
  "Offline listening",
  "Curated content for you",
  "New titles every week",
];

export default function ChoosePlanPage() {
  const [selected, setSelected] = useState("premium-plus");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCheckout() {
    const plan = PLANS.find((p) => p.id === selected);
    if (!plan) return;

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId }),
      });
      const { url } = await res.json();
      if (url) router.push(url);
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="choose-plan__wrapper">
        <div className="choose-plan__content">

          <div className="choose-plan__header">
            <div className="choose-plan__title">Get unlimited access to many amazing books to read</div>
            <div className="choose-plan__subtitle">
              Turn your downtime into learning time with key insights from bestselling nonfiction.
            </div>
          </div>

          <ul className="choose-plan__features">
            {FEATURES.map((f) => (
              <li key={f} className="choose-plan__feature">
                <BsCheckLg className="choose-plan__feature--icon" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="choose-plan__plans">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`choose-plan__plan${selected === plan.id ? " choose-plan__plan--selected" : ""}${plan.highlight ? " choose-plan__plan--highlight" : ""}`}
                onClick={() => setSelected(plan.id)}
              >
                {plan.highlight && (
                  <div className="choose-plan__plan--badge">Most Popular</div>
                )}
                <div className="choose-plan__plan--radio">
                  <div className={`choose-plan__plan--dot${selected === plan.id ? " choose-plan__plan--dot--active" : ""}`} />
                </div>
                <div className="choose-plan__plan--info">
                  <div className="choose-plan__plan--label">{plan.label}</div>
                  <div className="choose-plan__plan--price">{plan.price}</div>
                  <div className="choose-plan__plan--desc">{plan.description}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn choose-plan__btn"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Redirecting..." : "Start your free 7-day trial"}
          </button>

          <div className="choose-plan__note">
            Cancel anytime. No commitment required.
          </div>

        </div>
      </div>
    </div>
  );
}
