"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function SettingsPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user.uid) router.push("/");
  }, [user.uid]);

  const planLabel = {
    basic: "Basic",
    premium: "Premium",
    "premium-plus": "Premium Plus",
  }[user.plan];

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="settings__wrapper">
        <div className="settings__title">Settings</div>

        <div className="settings__section">
          <div className="settings__section--title">Your Subscription Plan</div>
          <div className="settings__plan">{planLabel}</div>
          {!user.isSubscribed && (
            <button
              className="btn settings__upgrade--btn"
              onClick={() => router.push("/choose-plan")}
            >
              Upgrade to Premium
            </button>
          )}
        </div>

        <div className="settings__section">
          <div className="settings__section--title">Email</div>
          <div className="settings__email">{user.email}</div>
        </div>
      </div>
    </div>
  );
}
