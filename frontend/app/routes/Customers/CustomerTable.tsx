import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../src/store/store";
import {
  setCurrentPage,
  updateCustomerStatusAsync,
} from "../../../src/store/customerSlice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "~/components/ui/pagination";

export default function CustomerTable({
  onViewDetails,
}: {
  onViewDetails: (id: number) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, search, filterStatus, currentPage } = useSelector(
    (state: RootState) => state.customers
  );

  const itemsPerPage = 10;

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && c.status === "active") ||
      (filterStatus === "inactive" && c.status === "inactive");

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
      <table className="w-full table-fixed border-collapse">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {["Customer", "Contact", "Orders", "Status", "Actions"].map(
              (h) => (
                <th
                  key={h}
                  className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 text-left"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {paginated.map((customer) => {
            const isActive = customer.status === "active";

            return (
              <tr
                key={customer.user_id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {customer.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {customer.user_id}
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {customer.email}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {customer.phone ?? "-"}
                  </div>
                </td>

                <td className="py-4 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {customer.orders_count ?? 0} orders
                  </span>
                </td>

                <td className="py-4 px-4 text-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="py-4 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onViewDetails(customer.user_id)}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() =>
                        dispatch(updateCustomerStatusAsync(customer.user_id))
                      }
                      className={`px-3 py-1 rounded text-xs font-medium text-white ${
                        isActive
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationPrevious
              onClick={() =>
                dispatch(setCurrentPage(Math.max(currentPage - 1, 1)))
              }
            />
            <PaginationContent>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => dispatch(setCurrentPage(i + 1))}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
            <PaginationNext
              onClick={() =>
                dispatch(
                  setCurrentPage(Math.min(currentPage + 1, totalPages))
                )
              }
            />
          </Pagination>
        </div>
      )}
    </div>
  );
}
