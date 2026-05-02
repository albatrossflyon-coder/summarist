"use client";

import { useDispatch } from "react-redux";
import { openAuthModal } from "@/store/authModalSlice";

export default function LoginButton() {
  const dispatch = useDispatch();

  return (
    <button
      className="btn home__cta--btn"
      onClick={() => dispatch(openAuthModal("login"))}
    >
      Login
    </button>
  );
}
