import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../../src/store/store";
import { setSearch, setFilterStatus } from "../../../src/store/customerSlice";

export default function CustomerFilters() {
  const dispatch = useDispatch();
  const { search, filterStatus } = useSelector((state: RootState) => state.customers);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div>
        <select
          value={filterStatus}
          onChange={(e) => dispatch(setFilterStatus(e.target.value as "all" | "active" | "inactive"))}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="all">All Customers</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>
    </div>
  );
}
