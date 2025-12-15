function SystemInfo() {
  return (
    <div className="glass-card p-6 bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
        <span className="mr-2">ℹ️</span>
        System Information
      </h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Database Version:
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            v1.0.0
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Total Storage Used:
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            2.4 GB
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Last Update:
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SystemInfo;
