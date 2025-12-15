import { useDispatch, useSelector } from "react-redux";
import type{ RootState, AppDispatch } from "../../../src/store/store";
import { setSearch, setFilterStatus, setCurrentPage } from "../../../src/store/orderSlice";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function OrdersFilters() {
  const dispatch = useDispatch<AppDispatch>();
  const { search, filterStatus } = useSelector((state: RootState) => state.orders);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Search orders..."
        value={search}
        onChange={(e) => {
          dispatch(setSearch(e.target.value));
          dispatch(setCurrentPage(1));
        }}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      />
      <select
        value={filterStatus}
        onChange={(e) => {
          dispatch(setFilterStatus(e.target.value));
          dispatch(setCurrentPage(1));
        }}
        className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      >
        <option value="all">All Statuses</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

