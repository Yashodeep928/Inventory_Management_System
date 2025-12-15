import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../src/store/store";
import {
  setCustomers,
  setLoading,
  setSelectedCustomer,
  setShowDetails,
} from "../../../src/store/customerSlice";

import CustomerStats from "../Customers/CustomerStats";
import CustomerFilters from "../Customers/CustomerFilter";
import CustomerTable from "../Customers/CustomerTable";
import CustomerDetails from "../Customers/CustomerDetails";

export default function Customers() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    customers,
    loading,
    selectedCustomer,
    showDetails,
  } = useSelector((state: RootState) => state.customers);

  useEffect(() => {
    const fetchCustomers = async () => {
      dispatch(setLoading(true));
      try {
        const res = await fetch(
          "http://localhost:3000/api/orders/all-customers"
        );
        const data = await res.json();

        // ✅ Normalize backend data
        const customersWithDefaults = (data.customers || []).map((c: any) => ({
          ...c,
          status: c.status ?? "active",
          orders_count: Number(c.orders_count ?? 0),
          phone: c.phone ?? "-",
        }));

        dispatch(setCustomers(customersWithDefaults));
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCustomers();
  }, [dispatch]);

  const handleViewDetails = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/orders/customer-details/${id}`
      );
      const json = await res.json();
      const payload = json.data ?? json;

      // ✅ Ensure status exists
      if (payload?.customer) {
        payload.customer.status = payload.customer.status ?? "active";
      }

      dispatch(setSelectedCustomer(payload));
      dispatch(setShowDetails(true));
    } catch (err) {
      console.error("Error fetching customer details:", err);
      dispatch(setSelectedCustomer(null));
      dispatch(setShowDetails(false));
    }
  };

  /* ===================== LOADING ===================== */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400" />
      </div>
    );
  }

  /* ===================== UI ===================== */

  return (
    <div className="space-y-6">
      <CustomerStats customers={customers} />

      <div className="glass-card p-6 bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700 rounded-xl">
        <CustomerFilters />
        <CustomerTable onViewDetails={handleViewDetails} />
      </div>

      <CustomerDetails
        open={showDetails}
        onClose={() => dispatch(setShowDetails(false))}
        detail={selectedCustomer}
      />
    </div>
  );
}
