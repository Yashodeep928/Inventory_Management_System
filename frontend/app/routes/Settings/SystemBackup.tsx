import Papa from "papaparse";

interface Props {
  customers: any[];
  orders: any[];
  products: any[];
  inventorySettings: any;
}

export default function SystemBackup({
  customers,
  orders,
  products,
  inventorySettings,
}: Props) {
  const backupDatabase = async () => {
    try {
      const backupData = {
        meta: {
          version: "1.0.0",
          createdAt: new Date().toISOString(),
        },
        data: {
          customers,
          orders,
          products,
          inventorySettings,
        },
      };

      // ✅ JSON is correct for full system backup
      const json = JSON.stringify(backupData, null, 2);

      const blob = new Blob([json], {
        type: "application/json;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inventory-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;

      a.click();
      URL.revokeObjectURL(url);

      alert("Database backup created successfully!");
    } catch (error) {
      console.error("Backup error:", error);
      alert("Error creating backup");
    }
  };

  return (
    <div className="glass-card p-6 bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
        <span className="mr-2">💾</span>
        System Backup
      </h2>

      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create a complete backup of your inventory system including all data
          and settings.
        </p>

        <button
          onClick={backupDatabase}
          className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
        >
          Create System Backup
        </button>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Backup frequency: {inventorySettings.backupFrequency}
        </div>
      </div>
    </div>
  );
}
