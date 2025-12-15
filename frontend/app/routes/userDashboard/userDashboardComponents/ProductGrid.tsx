import { useAppSelector, useAppDispatch } from "src/store/hooks";
import { setSelectedProduct } from "src/store/userProductSlice";
import { ProductCard } from "./ProductCard";

export const ProductGrid = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.products.list);
  const selectedCategory = useAppSelector((s) => s.products.selectedCategory);
  const selectedProduct = useAppSelector((s) => s.products.selectedProduct);

  // Robust filtering: show all products if category is empty
  const filteredProducts = products.filter((p) => {
    return !selectedCategory || p.category === selectedCategory;
  });

  if (filteredProducts.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400 mt-6">
        {products.length === 0
          ? "No products available."
          : selectedCategory
          ? "No products found in this category."
          : "Select a category to browse products."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.product_id}
          product={product}
          isSelected={selectedProduct === product.product_id}
          onSelect={() => dispatch(setSelectedProduct(product.product_id))}
          onDeselect={() => dispatch(setSelectedProduct(null))}
        />
      ))}
    </div>
  );
};
