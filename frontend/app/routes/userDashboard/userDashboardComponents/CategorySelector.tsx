import { useAppSelector, useAppDispatch } from "src/store/hooks";
import { setSelectedCategory } from "src/store/userProductSlice";

export const CategorySelector = () => {
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector((s) => s.products.selectedCategory);
  const products = useAppSelector((s) => s.products.list);

  // Get unique categories
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="glass-card p-6 bg-white dark:bg-gray-800">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <span className="mr-2">🏷️</span>
        Browse Products
      </h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 
                     focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
