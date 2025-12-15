import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../src/store/store";
import { fetchOrdersAsync } from "../../../src/store/orderSlice";
import OrdersStats from "../Orders/OrdersStats";
import OrdersFilters from "../Orders/OrdersFilters";
import OrdersTable from "../Orders/OrdersTable";
import OrdersPagination from "../Orders/OrdersPagination";

export default function Orders() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchOrdersAsync());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <OrdersStats />
      <OrdersFilters />
      <OrdersTable />
      <OrdersPagination totalPages={10} />
    </div>
  );
}
