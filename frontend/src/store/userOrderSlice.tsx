import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrderRow } from "../../app/routes/userDashboard/utils/types";

interface OrdersState {
  list: OrderRow[];
  loading: boolean;
}

const initialState: OrdersState = {
  list: [],
  loading: false,
};

const userOrdersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<OrderRow[]>) {
      state.list = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setOrders, setLoading } = userOrdersSlice.actions;
export default userOrdersSlice.reducer;
