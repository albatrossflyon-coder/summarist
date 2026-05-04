import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  uid: string | null;
  email: string | null;
  isSubscribed: boolean;
  plan: "basic" | "premium" | "premium-plus";
  authLoading: boolean;
}

const initialState: UserState = {
  uid: null,
  email: null,
  isSubscribed: false,
  plan: "basic",
  authLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
    },
    setSubscription: (state, action) => {
      state.isSubscribed = action.payload.isSubscribed;
      state.plan = action.payload.plan;
    },
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
      state.isSubscribed = false;
      state.plan = "basic";
    },
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
  },
});

export const { setUser, setSubscription, clearUser, setAuthLoading } = userSlice.actions;
export default userSlice.reducer;
