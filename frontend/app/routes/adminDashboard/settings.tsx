import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../src/store/store";
import {
  setCustomers,
  setOrders,
  setProducts,
  setLoading,
} from "../../../src/store/settingsSlice";

import SystemOverview from "../Settings/SystemOverview";
import ProfileSettings from "../Settings/ProfileSettings";
import InventorySettings from "../Settings/InventorySettings";
import LowStockAlert from "../Settings/LowStockAlert";
import DataExport from "../Settings/DataExport";
import SystemBackup from "../Settings/SystemBackup";
import SystemInfo from "../Settings/SystemInfo";

function Settings() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    customers,
    orders,
    products,
    inventorySettings,
    loading,
    name,
    email,
  } = useSelector((state: RootState) => state.settings);

  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, orderRes, productRes] = await Promise.all([
          fetch("http://localhost:3000/api/orders/all-customers"),
          fetch("http://localhost:3000/api/orders/all"),
          fetch("http://localhost:3000/api/products/get"),
        ]);

        const [custData, orderData, productData] = await Promise.all([
          custRes.json(),
          orderRes.json(),
          productRes.json(),
        ]);

        dispatch(setCustomers(custData.customers || []));
        dispatch(setOrders(orderData.orders || []));
        dispatch(setProducts(productData.products || []));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-gray-900 dark:text-gray-100">
      {/* System Overview */}
      <SystemOverview
        customers={customers}
        orders={orders}
        products={products}
        totalInventoryValue={totalInventoryValue}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <ProfileSettings name={name} email={email} />
          <InventorySettings inventorySettings={inventorySettings} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <LowStockAlert
            products={products}
            inventorySettings={inventorySettings}
          />
          <DataExport
            customers={customers}
            orders={orders}
            products={products}
          />
          <SystemBackup
            customers={customers}
            orders={orders}
            products={products}
            inventorySettings={inventorySettings}
          />
          <SystemInfo />
        </div>
      </div>
    </div>
  );
}

export default Settings;
