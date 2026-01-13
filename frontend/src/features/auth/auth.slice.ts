import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthUIState = {
    isAuthModalOpen: boolean;
    redirectAfterLogin: string | null;
};

const initialState: AuthUIState = {
    isAuthModalOpen: false,
    redirectAfterLogin: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        openAuthModal(state) {
            state.isAuthModalOpen = true;
        },

        closeAuthModal(state) {
            state.isAuthModalOpen = false;
        },

        setRedirectAfterLogin(state, action: PayloadAction<string>) {
            state.redirectAfterLogin = action.payload;
        },

        clearRedirectAfterLogin(state) {
            state.redirectAfterLogin = null;
        },
    },
});

export const {
  openAuthModal,
  closeAuthModal,
  setRedirectAfterLogin,
  clearRedirectAfterLogin,
} = authSlice.actions;

export default authSlice.reducer;