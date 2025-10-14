import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  user_id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  form: {
    username: string;
    email: string;
    password: string;
  };
  isLoading: boolean;
  error: string | null;
  formErrors: {
    username?: string;
    email?: string;
    password?: string;
  };
  role: string | null;
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

// ✅ Safe way to read from localStorage
const getStoredToken = (): string | null => {
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem("token");
  }
  return null;
};

const getStoredUser = (): User | null => {
  if (typeof window !== "undefined" && window.localStorage) {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

const initialState: AuthState = {
  form: {
    username: "",
    email: "",
    password: "",
  },
  isLoading: false,
  error: null,
  formErrors: {},
  role: getStoredUser()?.role ?? null, // set role from stored user
  isLoggedIn: !!getStoredToken(),
  user: getStoredUser(),
  token: getStoredToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateForm: (
      state,
      action: PayloadAction<{ field: string; value: string }>
    ) => {
      state.form[action.payload.field as keyof typeof state.form] =
        action.payload.value;
    },
    setFormErrors: (state, action: PayloadAction<AuthState["formErrors"]>) => {
      state.formErrors = action.payload;
    },
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.role = action.payload.user.role;
      state.token = action.payload.token;

      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
      state.user = null;
      state.role = null;
      state.token = null;

      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = null;
      state.user = null;
      state.error = null;
      state.token = null;

      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
});

export const {
  updateForm,
  setFormErrors,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
