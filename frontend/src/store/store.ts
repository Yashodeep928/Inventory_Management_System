// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";

// Import all slices
import authReducer from "./authSlice";

import settingsReducer from "./settingsSlice";
import customersReducer from "./customerSlice";
import ordersReducer from "./orderSlice";
import dashboardReducer from "./dashboardSlice";
import userOrderReducer from "./userOrderSlice";
import userProductReducer from "./userProductSlice";
import { socketMiddleware } from "./SocketMiddleware";


// Create store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    customers: customersReducer,
    orders: ordersReducer,
    dashboard: dashboardReducer,
    userOrders: userOrderReducer,
    products: userProductReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
});

// Types for Redux usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
