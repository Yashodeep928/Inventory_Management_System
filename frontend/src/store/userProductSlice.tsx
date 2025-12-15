import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../app/routes/userDashboard/utils/types";

interface ProductState {
  list: Product[];
  loading: boolean;
  selectedProduct: number | null;
  selectedCategory: string;
  quantity: number;
}

const initialState: ProductState = {
  list: [],
  loading: false,
  selectedProduct: null,
  selectedCategory: "",
  quantity: 1,
};

const userProductSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.list = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSelectedProduct(state, action: PayloadAction<number | null>) {
      state.selectedProduct = action.payload;
      state.quantity = 1;
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setQuantity(state, action: PayloadAction<number>) {
      state.quantity = action.payload;
    },
    updateProductQuantity(state, action: PayloadAction<{product_id:number, quantity:number}>) {
      const { product_id, quantity } = action.payload;
      const prod = state.list.find(p => p.product_id === product_id);
      if (prod) prod.quantity = quantity;
    }
  },
});

export const { setProducts, setLoading, setSelectedProduct, setSelectedCategory, setQuantity, updateProductQuantity } = userProductSlice.actions;
export default userProductSlice.reducer;
