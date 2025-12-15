import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

/* -------------------- TYPES -------------------- */
export interface Order {
  order_id: number;
  order_status: string;
  order_date: string;
  name: string;
  email: string;
  user_id: number;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  search: string;
  filterStatus: string;
  currentPage: number;
  error: string | null;
}

/* -------------------- INITIAL STATE -------------------- */
const initialState: OrdersState = {
  orders: [],
  loading: false,
  search: "",
  filterStatus: "all",
  currentPage: 1,
  error: null,
};

/* -------------------- FETCH ORDERS -------------------- */
export const fetchOrdersAsync = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:3000/api/orders/all");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      return data.orders ?? [];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/* -------------------- UPDATE ORDER STATUS -------------------- */
export const updateOrderStatusAsync = createAsyncThunk(
  "orders/updateStatus",
  async (
    { orderId, status }: { orderId: number; status: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/orders/update-status/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error("Failed to update order");

      const data = await res.json();
      return data.order; // backend returns updated order
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/* -------------------- SLICE -------------------- */
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---- Fetch Orders ---- */
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ---- Update Order Status ---- */
      .addCase(updateOrderStatusAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const order = state.orders.find(
          (o) => o.order_id === updatedOrder.order_id
        );
        if (order) {
          order.order_status = updatedOrder.order_status;
        }
        state.loading = false;
      })
      .addCase(updateOrderStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

/* -------------------- EXPORTS -------------------- */
export const {
  setSearch,
  setFilterStatus,
  setCurrentPage,
} = ordersSlice.actions;

export default ordersSlice.reducer;
