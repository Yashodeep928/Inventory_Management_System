import CircularProgress from "~/components/ui/CircularProgress";
import { useSelector } from "react-redux";
import type { RootState } from "../../../src/store/store";

interface Metric {
  label: string;
  value: number;
  color: string;
  trend?: { value: string; isPositive: boolean };
}

export default function PerformanceMetrics() {
  const { completionPct = 0, satisfactionPct = 0 } = useSelector(
    (state: RootState) => state.dashboard
  );

  const metrics: Metric[] = [
    {
      label: "Order Completion Rate",
      value: completionPct,
      color: "#00A86B",
      trend: { value: "5%", isPositive: true },
    },
    {
      label: "Customer Satisfaction",
      value: satisfactionPct,
      color: "#14B8A6",
      trend: { value: "2%", isPositive: false },
    },
  ];

  return (
    <div className="glass-card p-6 dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Performance Metrics
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <CircularProgress
              percentage={metric.value}
              color={metric.color}
              aria-label={`${metric.label}: ${metric.value}%`}
            />
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <span>{metric.label}</span>
              <div className="flex items-center space-x-2 font-medium text-gray-900 dark:text-gray-100">
                <span>{metric.value}%</span>
                {metric.trend && (
                  <span
                    className={`text-xs ${
                      metric.trend.isPositive
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {metric.trend.isPositive ? "↗" : "↘"} {metric.trend.value}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
