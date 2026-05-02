import { createSlice } from "@reduxjs/toolkit";

interface AuthModalState {
  isOpen: boolean;
  type: "login" | "register";
}

const initialState: AuthModalState = {
  isOpen: false,
  type: "login",
};

const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    openAuthModal: (state, action) => {
      state.isOpen = true;
      state.type = action.payload ?? "login";
    },
    closeAuthModal: (state) => {
      state.isOpen = false;
    },
    setAuthModalType: (state, action) => {
      state.type = action.payload;
    },
  },
});

export const { openAuthModal, closeAuthModal, setAuthModalType } = authModalSlice.actions;
export default authModalSlice.reducer;
