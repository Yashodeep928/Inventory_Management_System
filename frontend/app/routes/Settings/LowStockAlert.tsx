interface Product {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

interface InventorySettings {
  lowStockThreshold: number;
}

interface Props {
  products: Product[];
  inventorySettings: InventorySettings;
}

export default function LowStockAlert({
  products,
  inventorySettings,
}: Props) {
  const lowStockProducts = products.filter(
    (p) => p.quantity < inventorySettings.lowStockThreshold
  );

  return (
    <div className="glass-card p-6 bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
        <span className="mr-2">⚠️</span>
        Low Stock Alerts
      </h2>

      {lowStockProducts.length > 0 ? (
        <div className="space-y-3">
          {lowStockProducts.slice(0, 5).map((product) => (
            <div
              key={product.product_id}
              className="flex items-center justify-between p-3 rounded-lg
                         bg-red-50 dark:bg-red-900/30
                         border border-red-200 dark:border-red-800"
            >
              <div>
                <div className="font-medium text-red-800 dark:text-red-300">
                  {product.name}
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  Only {product.quantity} left in stock
                </div>
              </div>

              <span className="font-medium text-red-700 dark:text-red-300">
                ₹{product.price}
              </span>
            </div>
          ))}

          {lowStockProducts.length > 5 && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              And {lowStockProducts.length - 5} more products...
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-gray-600 dark:text-gray-400">
            All products are well stocked!
          </div>
        </div>
      )}
    </div>
  );
}
