import { useSelector } from "react-redux";
import type { RootState } from "../../../src/store/store";
import { BarChart } from "~/components/ui";

export default function RevenueChart() {
  const { monthlyRevenue } = useSelector(
    (state: RootState) => state.dashboard
  );

  return (
    <div className="glass-card p-6 lg:col-span-2 bg-white dark:bg-gray-900">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Monthly Overview
      </h3>

      <div className="w-full h-full">
        <BarChart data={monthlyRevenue} />
      </div>
    </div>
  );
}
