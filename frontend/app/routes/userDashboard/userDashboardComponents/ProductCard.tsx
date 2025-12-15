import type { Product } from "../utils/types";
import { formatINR } from "../utils/formatINR";

export function ProductCard({
  product,
  isSelected,
  onSelect,
  onDeselect,
}: {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
}) {
  return (
    <div
      className={`glass-card hover-lift p-4 cursor-pointer transition-all duration-200 border-2 rounded-lg ${
        isSelected
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900 shadow-lg dark:border-emerald-400"
          : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-500 dark:bg-gray-800"
      }`}
      onClick={isSelected ? onDeselect : onSelect}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.category}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatINR(product.price)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {product.quantity > 0 ? (
                <span className="text-green-600 dark:text-green-400">
                  In Stock ({product.quantity})
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400">Out of Stock</span>
              )}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          isSelected ? onDeselect() : onSelect();
        }}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
          isSelected
            ? "bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700"
            : "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600"
        } ${product.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={product.quantity === 0}
      >
        {isSelected ? "Remove from Cart" : "Add to Cart"}
      </button>
    </div>
  );
}
