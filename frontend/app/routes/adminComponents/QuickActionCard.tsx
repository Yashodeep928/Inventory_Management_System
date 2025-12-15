interface QuickActionCardProps {
  title: string;
  description: string;
  onClick: () => void;
  icon: string;
  color?: "emerald" | "blue" | "purple" | "orange" | "red" | "yellow";
}

export default function QuickActionCard({
  title,
  description,
  onClick,
  icon,
  color = "emerald",
}: QuickActionCardProps) {
  const bgClasses = {
    emerald: "bg-emerald-100 dark:bg-emerald-900/20",
    blue: "bg-blue-100 dark:bg-blue-900/20",
    purple: "bg-purple-100 dark:bg-purple-900/20",
    orange: "bg-orange-100 dark:bg-orange-900/20",
    red: "bg-red-100 dark:bg-red-900/20",
    yellow: "bg-yellow-100 dark:bg-yellow-900/20",
  };

  const textClasses = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    orange: "text-orange-600 dark:text-orange-400",
    red: "text-red-600 dark:text-red-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="glass-card hover-lift p-4 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg transition-all duration-200 dark:bg-gray-900"
    >
      <div className="flex items-center space-x-3">
        <div
          className={`w-10 h-10 rounded-lg ${bgClasses[color]} flex items-center justify-center`}
        >
          <span className={`${textClasses[color]} text-lg`}>{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
