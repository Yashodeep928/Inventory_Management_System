import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

/* ===================== TYPES ===================== */

export interface Customer {
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  status: "active" | "inactive";
  orders_count?: string;
}

export interface CustomerDetail {
  customer: Customer;
  orders: Array<{
    order_id: number;
    order_status: string;
    order_date: string;
    product_id: number;
    quantity: number;
    price: number;
    product_name: string;
  }>;
}

interface CustomersState {
  customers: Customer[];
  loading: boolean;
  selectedCustomer: CustomerDetail | null;
  showDetails: boolean;
  search: string;
  filterStatus: "all" | "active" | "inactive";
  currentPage: number;
  error: string | null;
}

/* ===================== INITIAL STATE ===================== */

const initialState: CustomersState = {
  customers: [],
  loading: false,
  selectedCustomer: null,
  showDetails: false,
  search: "",
  filterStatus: "all",
  currentPage: 1,
  error: null,
};

/* ===================== ASYNC THUNKS ===================== */

// Toggle customer active/inactive status
export const updateCustomerStatusAsync = createAsyncThunk<
  Customer,
  number,
  { rejectValue: string }
>(
  "customers/updateStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/orders/toggle-customer/${userId}`, // <-- updated
        { method: "PUT" }
      );

      if (!res.ok) throw new Error("Failed to update customer status");

      const data = await res.json();
      return data.customer;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


/* ===================== SLICE ===================== */

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setSelectedCustomer: (
      state,
      action: PayloadAction<CustomerDetail | null>
    ) => {
      state.selectedCustomer = action.payload;
    },

    setShowDetails: (state, action: PayloadAction<boolean>) => {
      state.showDetails = action.payload;
    },

    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    setFilterStatus: (
      state,
      action: PayloadAction<"all" | "active" | "inactive">
    ) => {
      state.filterStatus = action.payload;
    },

    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(updateCustomerStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateCustomerStatusAsync.fulfilled, (state, action) => {
        const updated = action.payload;

        // Update customers list
        const customer = state.customers.find(
          (c) => c.user_id === updated.user_id
        );
        if (customer) {
          customer.status = updated.status;
        }

        // Update selected customer (modal)
        if (
          state.selectedCustomer &&
          state.selectedCustomer.customer.user_id === updated.user_id
        ) {
          state.selectedCustomer.customer.status = updated.status;
        }

        state.loading = false;
      })

      .addCase(updateCustomerStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

/* ===================== EXPORTS ===================== */

export const {
  setCustomers,
  setLoading,
  setSelectedCustomer,
  setShowDetails,
  setSearch,
  setFilterStatus,
  setCurrentPage,
} = customersSlice.actions;

export default customersSlice.reducer;
