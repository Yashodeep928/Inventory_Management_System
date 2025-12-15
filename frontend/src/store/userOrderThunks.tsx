import { createAsyncThunk } from "@reduxjs/toolkit";
import { setOrders, setLoading } from "./userOrderSlice";
import { updateProductStock } from "./userProductThunks";
import type { Product } from "../../app/routes/userDashboard/utils/types";

// Fetch user orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (userId: number, { dispatch }) => {
    dispatch(setLoading(true));

    try {
      const res = await fetch(`http://localhost:3000/api/orders/get/${userId}`);
      const data = await res.json();

      dispatch(setOrders(data.orders ?? []));
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Place an order
export const placeOrder = createAsyncThunk(
  "orders/place",
  async (
    { userId, product, quantity }: { userId: number; product: Product; quantity: number },
    { dispatch }
  ) => {
    dispatch(setLoading(true));

    try {
      const res = await fetch(
        `http://localhost:3000/api/orders/create/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: product.product_id,
            quantity,
            price: product.price,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to place order");
      }

      await dispatch(updateProductStock({ product, quantity }));
      await dispatch(fetchOrders(userId));
    } catch (err) {
      console.error("Error placing order:", err);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }
);
