import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "src/store/hooks";
import {
  setSelectedProduct,
  setQuantity,
} from "src/store/userProductSlice";
import { fetchProducts } from "src/store/userProductThunks";
import { fetchOrders, placeOrder } from "src/store/userOrderThunks";

import { Header } from "./userDashboardComponents/Header";
import { QuickStats } from "./userDashboardComponents/QuickStats";
import { RecentOrders } from "./userDashboardComponents/RecentOrders";
import { OrderForm } from "./userDashboardComponents/orderForm";
import { ProductGrid } from "./userDashboardComponents/ProductGrid";
import { CategorySelector } from "./userDashboardComponents/CategorySelector";
import { LoadingSpinner } from "./userDashboardComponents/loading";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.auth.user);
  const products = useAppSelector((s) => s.products.list);
  const selectedProduct = useAppSelector((s) => s.products.selectedProduct);
  const quantity = useAppSelector((s) => s.products.quantity);
  const loadingProducts = useAppSelector((s) => s.products.loading);
  const loadingOrders = useAppSelector((s) => s.orders.loading);

  const selectedProductObj = products.find(
    (p) => p.product_id === selectedProduct
  );

  useEffect(() => {
    dispatch(fetchProducts());
    if (authUser?.user_id) dispatch(fetchOrders(authUser.user_id));
  }, [dispatch, authUser?.user_id]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser?.user_id) return alert("User not logged in");
    if (!selectedProductObj) return alert("Select a product first");
    if (quantity > selectedProductObj.quantity)
      return alert("Not enough stock available");

    try {
      await dispatch(
        placeOrder({
          userId: authUser.user_id,
          product: selectedProductObj,
          quantity,
        })
      ).unwrap();

      dispatch(setSelectedProduct(null));
      dispatch(setQuantity(1));
      alert("Order placed successfully!");
    } catch (err: any) {
      alert("Failed to place order: " + (err.message ?? "Unknown error"));
    }
  };

  if (loadingProducts || loadingOrders) {
    return <LoadingSpinner size={12} />;
  }

  return (
    <div className="space-y-8 text-gray-900 dark:text-gray-100">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 bg-white dark:bg-gray-800">
            <CategorySelector />
            <ProductGrid />
          </div>

          {selectedProductObj && (
            <OrderForm placeOrder={handlePlaceOrder} />
          )}
        </div>

        <div className="space-y-6">
          <RecentOrders />
          <QuickStats />
        </div>
      </div>
    </div>
  );
}
