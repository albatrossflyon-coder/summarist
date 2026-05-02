"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { closeAuthModal, setAuthModalType } from "@/store/authModalSlice";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setUser, clearUser } from "@/store/userSlice";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOpen, type } = useSelector((state: RootState) => state.authModal);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(closeAuthModal());
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (type === "register") {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        dispatch(setUser({ uid: result.user.uid, email: result.user.email }));
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        dispatch(setUser({ uid: result.user.uid, email: result.user.email }));
      }
      handleClose();
      router.push("/for-you");
    } catch (err: any) {
      const code = err.code;
      if (code === "auth/invalid-email") setError("Invalid email address.");
      else if (code === "auth/weak-password") setError("Password must be at least 6 characters.");
      else if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential")
        setError("User not found or incorrect password.");
      else setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, "guest@summarist.com", "guest123");
      dispatch(setUser({ uid: result.user.uid, email: result.user.email }));
      handleClose();
      router.push("/for-you");
    } catch {
      setError("Guest login unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal__overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <span className="modal__close" onClick={handleClose}>✕</span>
        <h2 className="modal__title">
          {type === "register" ? "Create your account" : "Log in to Summarist"}
        </h2>

        <button
          className="btn modal__btn modal__btn--guest"
          onClick={handleGuestLogin}
          disabled={loading}
        >
          Login as Guest
        </button>

        <div className="modal__separator">— or —</div>

        <form onSubmit={handleSubmit}>
          {error && <p className="modal__error">{error}</p>}
          <input
            className="modal__input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="modal__input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn modal__btn" type="submit" disabled={loading}>
            {loading ? "Please wait..." : type === "register" ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="modal__switch">
          {type === "register" ? (
            <>
              Already have an account?{" "}
              <span onClick={() => dispatch(setAuthModalType("login"))}>Login</span>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <span onClick={() => dispatch(setAuthModalType("register"))}>Sign Up</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
