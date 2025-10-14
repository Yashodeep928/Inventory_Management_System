import { useState } from "react";
import ProductForm, {type Product } from "~/components/ui/ProductForm";
import ProductList from "~/components/ui/ProductList";

export default function AdminProductsPage() {
  // Match the Product interface (uses product_id)
  const [editing, setEditing] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Products</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            {editing ? "Edit product" : "Add new product"}
          </h3>
          <ProductForm
            key={editing ? editing.product_id ?? "edit" : `new-${refreshKey}`}
            productToEdit={editing ?? null} // ✅ renamed correctly
            onSuccess={() => {
              setEditing(null);
              setRefreshKey((k) => k + 1);
            }}
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Product list</h3>
          <ProductList
            key={refreshKey}
            onEdit={(p) => setEditing(p)} // ✅ works now
            onDelete={() => setRefreshKey((k) => k + 1)} // Refresh list after deletion
          />
        </div>
      </div>
    </div>
  );
}
