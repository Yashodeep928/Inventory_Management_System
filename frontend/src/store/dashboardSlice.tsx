import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

// ----- Types -----
interface MonthlyRevenue {
  label: string;
  value: number;
}

interface DashboardStats {
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
}

interface Order {
  order_id: number;
  order_status: string;
  quantity?: number;
  price?: number;
  [key: string]: any; // extra fields like order_date, user_id
}

interface Product {
  product_id: number;
  quantity: number;
  [key: string]: any; // extra fields
}

interface DashboardState {
  stats: DashboardStats;
  monthlyRevenue: MonthlyRevenue[];
  completionPct: number;
  satisfactionPct: number;
  loading: boolean;
  error: string | null;
}

// ----- Initial State -----
const initialState: DashboardState = {
  stats: {
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  },
  monthlyRevenue: [],
  completionPct: 0,
  satisfactionPct: 0,
  loading: false,
  error: null,
};

// ----- Async Thunk -----
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const [
        ordersRes,
        customersRes,
        productsRes,
        revenueRes
      ] = await Promise.all([
        fetch("http://localhost:3000/api/orders/all"),
        fetch("http://localhost:3000/api/orders/all-customers"),
        fetch("http://localhost:3000/api/products/get"),
        fetch("http://localhost:3000/api/admin/dashboard/monthly-revenue")
      ]);

      const [
        ordersData,
        customersData,
        productsData,
        revenueData
      ] = await Promise.all([
        ordersRes.json(),
        customersRes.json(),
        productsRes.json(),
        revenueRes.json(),
      ]);

      const orders: Order[] = ordersData.orders || [];
      const customers = customersData.customers || [];
      const products: Product[] = productsData.products || [];

      // Backend monthly revenue
      const backendRevenue: MonthlyRevenue[] = revenueData.data || [];

      // Ensure all 12 months are present
      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const monthlyRevenue: MonthlyRevenue[] = monthNames.map(month => {
        const found = backendRevenue.find(r => r.label === month);
        return { label: month, value: found ? found.value : 0 };
      });

      // Stats
      const stats: DashboardStats = {
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalRevenue: monthlyRevenue.reduce((sum, m) => sum + m.value, 0),
        pendingOrders: orders.filter((o: Order) => o.order_status === "pending").length,
        lowStockProducts: products.filter((p: Product) => p.quantity < 10).length,
      };

      // Performance metrics
      const totalCount = orders.length || 1;
      const deliveredCount = orders.filter(
        (o: Order) => (o.order_status ?? "").toLowerCase() === "delivered"
      ).length;

      const cancelledCount = orders.filter(
        (o: Order) => (o.order_status ?? "").toLowerCase() === "cancelled"
      ).length;

      const completionPct = Math.round((deliveredCount / totalCount) * 100);
      const satisfactionPct = Math.round(
        (deliveredCount / (deliveredCount + cancelledCount || 1)) * 100
      );

      return { stats, monthlyRevenue, completionPct, satisfactionPct };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ----- Slice -----
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDashboardData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDashboardData.fulfilled,
        (state, action: PayloadAction<{
          stats: DashboardStats;
          monthlyRevenue: MonthlyRevenue[];
          completionPct: number;
          satisfactionPct: number;
        }>) => {
          state.stats = action.payload.stats;
          state.monthlyRevenue = action.payload.monthlyRevenue;
          state.completionPct = action.payload.completionPct;
          state.satisfactionPct = action.payload.satisfactionPct;
          state.loading = false;
        }
      )
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default dashboardSlice.reducer;
