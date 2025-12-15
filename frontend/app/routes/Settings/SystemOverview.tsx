interface Props {
  customers: any[];
  orders: any[];
  products: any[];
  totalInventoryValue: number;
}

export default function SystemOverview({
  customers,
  orders,
  products,
  totalInventoryValue,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Customers */}
      <div className="glass-card p-4 border-l-4 border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-900">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {customers.length}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Customers
        </div>
      </div>

      {/* Orders */}
      <div className="glass-card p-4 border-l-4 border-green-500 dark:border-green-400 bg-white dark:bg-gray-900">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {orders.length}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Orders
        </div>
      </div>

      {/* Products */}
      <div className="glass-card p-4 border-l-4 border-purple-500 dark:border-purple-400 bg-white dark:bg-gray-900">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {products.length}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Products
        </div>
      </div>

      {/* Inventory Value */}
      <div className="glass-card p-4 border-l-4 border-orange-500 dark:border-orange-400 bg-white dark:bg-gray-900">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          ₹{totalInventoryValue.toFixed(2)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Inventory Value
        </div>
      </div>
    </div>
  );
}
