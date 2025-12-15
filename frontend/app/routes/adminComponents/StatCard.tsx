interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon?: string;
  color?: "emerald" | "blue" | "purple" | "orange" | "red" | "yellow";
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const BORDER_COLORS: Record<
  NonNullable<StatCardProps["color"]>,
  string
> = {
  emerald: "border-l-emerald-500",
  blue: "border-l-blue-500",
  purple: "border-l-purple-500",
  orange: "border-l-orange-500",
  red: "border-l-red-500",
  yellow: "border-l-yellow-500",
};

const ICON_COLORS: Record<
  NonNullable<StatCardProps["color"]>,
  string
> = {
  emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  purple: "bg-purple-50 border-purple-200 text-purple-700",
  orange: "bg-orange-50 border-orange-200 text-orange-700",
  red: "bg-red-50 border-red-200 text-red-700",
  yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = "emerald",
  trend,
}: StatCardProps) {
  return (
    <div
      className={`glass-card hover-lift p-6 border-l-4 ${
        BORDER_COLORS[color]
      } bg-white dark:bg-gray-900`}
    >
      <div className="flex items-center justify-between">
        {/* Left content */}
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </div>

          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {value}
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </div>

          {trend && (
            <div
              className={`text-xs mt-2 flex items-center gap-1 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              <span aria-hidden="true">
                {trend.isPositive ? "↗" : "↘"}
              </span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
              ICON_COLORS[color]
            } dark:bg-gray-800 dark:border-gray-700`}
            aria-hidden="true"
          >
            <span className="text-2xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}
