import { useAppSelector, useAppDispatch } from "src/store/hooks";
import { setQuantity } from "src/store/userProductSlice";
import { formatINR } from "../utils/formatINR";

export const OrderForm = ({ placeOrder }: { placeOrder: (e: React.FormEvent) => void }) => {
  const dispatch = useAppDispatch();

  // Corrected slice path
  const selectedProductObj = useAppSelector((s) =>
    s.products.list.find(p => p.product_id === s.products.selectedProduct)
  );
  const quantity = useAppSelector((s) => s.products.quantity);

  if (!selectedProductObj) return null;

  const isOrderDisabled = quantity < 1 || quantity > selectedProductObj.quantity;

  return (
    <div className="glass-card p-6">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <span className="mr-2">🛒</span>Place Order
      </h4>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h5 className="font-semibold text-gray-900 dark:text-gray-100">
              {selectedProductObj.name}
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedProductObj.category}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatINR(selectedProductObj.price)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Stock: {selectedProductObj.quantity}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={placeOrder} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            max={selectedProductObj.quantity}
            value={quantity}
            onChange={(e) => dispatch(setQuantity(Number(e.target.value)))}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Enter quantity"
          />
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span className="text-emerald-700 dark:text-emerald-400">
              Total Amount:
            </span>
            <span className="font-semibold text-emerald-900 dark:text-emerald-300">
              {formatINR(selectedProductObj.price * quantity)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isOrderDisabled}
          className="w-full bg-emerald-600 dark:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isOrderDisabled ? "Cannot Place Order" : "Place Order"}
        </button>
      </form>
    </div>
  );
};
