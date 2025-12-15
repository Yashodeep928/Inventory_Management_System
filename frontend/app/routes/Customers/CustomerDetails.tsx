import React from "react";
import type { CustomerDetail } from "../../../src/store/customerSlice";

/* ===================== TYPES ===================== */

type OrderItem = {
  order_id: number;
  order_status: string;
  order_date: string;
  product_id?: number;
  quantity: number;
  price: number;
  product_name?: string;
};

/* ===================== COMPONENT ===================== */

export default function CustomerDetails({
  open,
  onClose,
  detail,
}: {
  open: boolean;
  onClose: () => void;
  detail: CustomerDetail | null;
}) {
  if (!open || !detail) return null;

  const { customer, orders } = detail;

  const totalSpent = orders.reduce(
    (sum, o) => sum + Number(o.price) * Number(o.quantity),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Customer Details — {customer.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              ID: {customer.user_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact */}
            <div className="glass-card p-4 bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Contact
              </h4>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <div>
                  <span className="font-medium">Email:</span> {customer.email}
                </div>

                <div className="mt-2">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {customer.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card p-4 bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Order Summary
              </h4>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <div>
                  <span className="font-medium">Total Orders:</span>{" "}
                  {orders.length}
                </div>
                <div>
                  <span className="font-medium">Total Spent:</span>{" "}
                  ₹{totalSpent.toLocaleString("en-IN")}
                </div>
                <div>
                  <span className="font-medium">Last Order:</span>{" "}
                  {orders.length > 0
                    ? new Date(
                        Math.max(
                          ...orders.map((o) =>
                            new Date(o.order_date).getTime()
                          )
                        )
                      ).toLocaleDateString()
                    : "No orders yet"}
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="glass-card p-4 bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Order History
            </h4>

            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-600 dark:text-gray-300">
                      <th className="py-2 px-3">Order ID</th>
                      <th className="py-2 px-3">Product</th>
                      <th className="py-2 px-3">Qty</th>
                      <th className="py-2 px-3">Price</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {orders.map((o) => (
                      <tr
                        key={o.order_id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-2 px-3 font-medium text-gray-900 dark:text-gray-100">
                          #{o.order_id}
                        </td>
                        <td className="py-2 px-3 text-gray-700 dark:text-gray-300">
                          {o.product_name ?? "-"}
                        </td>
                        <td className="py-2 px-3 text-gray-700 dark:text-gray-300">
                          {o.quantity}
                        </td>
                        <td className="py-2 px-3 text-gray-700 dark:text-gray-300">
                          ₹{(Number(o.price) * Number(o.quantity)).toFixed(2)}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              o.order_status === "delivered"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : o.order_status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : o.order_status === "shipped"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            }`}
                          >
                            {o.order_status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-gray-700 dark:text-gray-300">
                          {new Date(o.order_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No orders found for this customer.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
