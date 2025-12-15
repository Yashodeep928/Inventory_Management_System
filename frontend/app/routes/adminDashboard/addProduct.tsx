import { useState } from "react";
import ProductForm, { type Product } from "~/components/ui/ProductForm";
import ProductList from "~/components/ui/ProductList";

export default function AdminProductsPage() {
  // Match the Product interface (uses product_id)
  const [editing, setEditing] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Products
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add / Edit Product */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {editing ? "Edit product" : "Add Products"}
          </h3>

          <ProductForm
            key={editing ? editing.product_id ?? "edit" : `new-${refreshKey}`}
            productToEdit={editing ?? null}
            onSuccess={() => {
              setEditing(null);
              setRefreshKey((k) => k + 1);
            }}
          />
        </div>

        {/* Product List */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Product list
          </h3>

          <ProductList
            key={refreshKey}
            onEdit={(p) => setEditing(p)}
            onDelete={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      </div>
    </div>
  );
}
