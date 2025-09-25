import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  userRole: "user" | "admin" | null;
  isLoading: boolean;
  error: string | null;
  form: {
    username: string;
    email?: string;
    password: string;
  };
  formErrors: {
    username?: string;
    email?: string;
    password?: string;
  };
}

const initialState: AuthState = {
  isLoggedIn: false,
  userRole: null,
  isLoading: false,
  error: null,
  form: {
    username: "",
    email: "",
    password: "",
  },
  formErrors: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateForm: (
      state,
      action: PayloadAction<{ field: "username" | "email" | "password"; value: string }>
    ) => {
      state.form[action.payload.field] = action.payload.value;
      // Clear field error when user starts typing
      if (state.formErrors[action.payload.field]) {
        delete state.formErrors[action.payload.field];
      }
    },
    setFormErrors: (state, action: PayloadAction<{ [key: string]: string }>) => {
      state.formErrors = action.payload;
    },
    clearFormErrors: (state) => {
      state.formErrors = {};
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.formErrors = {};
    },
    loginSuccess: (state, action: PayloadAction<{ role: "user" | "admin" }>) => {
      state.isLoggedIn = true;
      state.userRole = action.payload.role;
      state.isLoading = false;
      state.error = null;
      // clear form
      state.form = { username: "", email: "", password: "" };
      state.formErrors = {};
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userRole = null;
      state.error = null;
      state.formErrors = {};
    },
  },
});

export const { 
  updateForm, 
  setFormErrors, 
  clearFormErrors, 
  setLoading, 
  setError, 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout 
} = authSlice.actions;
export default authSlice.reducer;
