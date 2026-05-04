"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./index";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setUser, clearUser, setAuthLoading } from "./userSlice";

function AuthListener() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        store.dispatch(setUser({ uid: fbUser.uid, email: fbUser.email }));
      } else {
        store.dispatch(clearUser());
      }
      store.dispatch(setAuthLoading(false));
    });
    return unsubscribe;
  }, []);
  return null;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthListener />
      {children}
    </Provider>
  );
}
