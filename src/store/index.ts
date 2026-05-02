import { configureStore } from "@reduxjs/toolkit";
import authModalReducer from "./authModalSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    authModal: authModalReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
