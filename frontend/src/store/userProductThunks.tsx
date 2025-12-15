import { createAsyncThunk } from "@reduxjs/toolkit";
import { setProducts, setLoading, updateProductQuantity } from "./userProductSlice";
import type { Product } from "../../app/routes/userDashboard/utils/types";

// Fetch all products
export const fetchProducts = createAsyncThunk<void, string | undefined>(
  "products/fetch",
  async (category, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      let url = "http://localhost:3000/api/products/get";
      if (category) {
        url += `?category=${encodeURIComponent(category)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      dispatch(setProducts(data.products ?? []));
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Update stock after order
export const updateProductStock = createAsyncThunk(
  "products/updateStock",
  async ({ product, quantity }: { product: Product; quantity: number }, { dispatch }) => {
    const newQty = product.quantity - quantity;

    dispatch(updateProductQuantity({ product_id: product.product_id, quantity: newQty }));

    try {
      await fetch(`http://localhost:3000/api/products/update/${product.product_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
    } catch (err) {
      console.error("Error updating product stock:", err);
    }
  }
);
