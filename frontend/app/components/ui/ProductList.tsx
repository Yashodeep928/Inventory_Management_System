import React, { useEffect, useState } from "react";
import type { Product } from "./ProductForm";

interface ProductListProps {
  onEdit?: (product: Product) => void;
  onDelete?: (productId: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onEdit, onDelete }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/products/get", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to fetch products");
      }

      const data = await response.json();
      setProducts((data.products ?? []) as Product[]);
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (productId?: number) => {
    if (!productId) return;

    if (
      !confirm(
        "Are you sure you want to delete this product? This will deactivate it in the system."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/products/delete/${productId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to delete product");
      }

      await load();

      if (onDelete) {
        onDelete(productId);
      }

      alert("Product deleted successfully!");
    } catch (e) {
      console.error("Error deleting product:", e);
      alert("Failed to delete product. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400">
        Loading products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        No products found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((p) => (
        <div
          key={p.product_id}
          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
        >
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {p.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {p.category} • ₹{p.price} • Qty: {p.quantity}
            </div>
          </div>

          <div className="flex space-x-2">
            {onEdit && (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                onClick={() => onEdit(p)}
                type="button"
              >
                Edit
              </button>
            )}

            <button
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
              onClick={() => handleDelete(p.product_id)}
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
