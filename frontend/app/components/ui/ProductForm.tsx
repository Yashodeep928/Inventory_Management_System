import React, { useEffect, useState } from "react";

export interface Product {
  product_id?: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  active?: boolean;
}

interface ProductFormProps {
  productToEdit?: Product | null;
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  productToEdit = null,
  onSuccess,
}) => {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const isEdit = Boolean(productToEdit?.product_id);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name ?? "");
      setCategory(productToEdit.category ?? "");
      setPrice(Number(productToEdit.price ?? 0));
      setQuantity(Number(productToEdit.quantity ?? 0));
    } else {
      setName("");
      setCategory("");
      setPrice(0);
      setQuantity(0);
    }
  }, [productToEdit]);

  /* ===================== API CALLS ===================== */

  const handleAdd = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3000/api/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, price, quantity }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to add product");
      }

      onSuccess();
    } catch (err) {
      console.error("Add product error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!productToEdit?.product_id) return;
    setSubmitting(true);

    try {
      const res = await fetch(
        `http://localhost:3000/api/products/update/${productToEdit.product_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, category, price, quantity }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to update product");
      }

      onSuccess();
    } catch (err) {
      console.error("Update product error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ===================== UI ===================== */

  return (
    <div className="mb-4">
      {isEdit && (
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Edit Product
        </h3>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="number"
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          placeholder="Price (INR)"
          value={!isEdit && price === 0 ? "" : price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />

        <input
          type="number"
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          placeholder="Quantity (units)"
          value={!isEdit && quantity === 0 ? "" : quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
      </div>

      <div className="mt-4">
        {isEdit ? (
          <button
            onClick={handleUpdate}
            disabled={submitting}
            type="button"
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded transition"
          >
            {submitting ? "Updating..." : "Update Product"}
          </button>
        ) : (
          <button
            onClick={handleAdd}
            disabled={submitting}
            type="button"
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-4 py-2 rounded transition"
          >
            {submitting ? "Adding..." : "Add Product"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
