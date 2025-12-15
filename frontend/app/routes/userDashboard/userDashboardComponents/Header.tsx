import { useAppSelector } from "src/store/hooks";

export function Header() {
  const authUser = useAppSelector((s) => s.auth.user);
  const orders = useAppSelector((s) => s.userOrders.list);

  const firstName = (authUser?.name ?? "User").split(" ")[0];

  return (
    <div className="glass-card p-6 bg-white dark:bg-gray-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Browse products and manage your orders.
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-lg p-3">
            <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
              Your Orders
            </div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">
              {orders.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
