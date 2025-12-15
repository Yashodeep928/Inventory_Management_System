import  { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Customer {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  orders_count?: number;
}

interface Order {
  order_id: string;
  name: string;
  email: string;
  order_status: string;
  order_date: string;
}

interface Product {
  product_id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface InventorySettings {
  lowStockThreshold: number;
  autoReorder: boolean;
  emailNotifications: boolean;
  backupFrequency: string;
}

interface SettingsState {
  name: string;
  email: string;
  customers: Customer[];
  orders: Order[];
  products: Product[];
  inventorySettings: InventorySettings;
  loading: boolean;
}

const initialState: SettingsState = {
  name: "",
  email: "",
  customers: [],
  orders: [],
  products: [],
  loading: true,
  inventorySettings: {
    lowStockThreshold: 10,
    autoReorder: false,
    emailNotifications: true,
    backupFrequency: "weekly",
  },
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setInventorySettings: (state, action: PayloadAction<InventorySettings>) => {
      state.inventorySettings = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateInventorySettingField: <K extends keyof InventorySettings>(
      state: SettingsState,
      action: PayloadAction<{ field: K; value: InventorySettings[K] }>
    ) => {
      const { field, value } = action.payload;
      state.inventorySettings[field] = value;
    },
  },
});



export const {
  setName,
  setEmail,
  setCustomers,
  setOrders,
  setProducts,
  setInventorySettings,
  setLoading,
  updateInventorySettingField
} = settingsSlice.actions;

export default settingsSlice.reducer;
