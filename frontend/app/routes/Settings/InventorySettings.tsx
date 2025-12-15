import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../src/store/store";
import {
  updateInventorySettingField,
  setInventorySettings,
} from "../../../src/store/settingsSlice";

interface InventorySettings {
  lowStockThreshold: number;
  autoReorder: boolean;
  emailNotifications: boolean;
  backupFrequency: string;
}

interface Props {
  inventorySettings: InventorySettings;
}

export default function InventorySettings({ inventorySettings }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const saveInventorySettings = () => {
    try {
      localStorage.setItem(
        "inventorySettings",
        JSON.stringify(inventorySettings)
      );
      dispatch(setInventorySettings(inventorySettings));
      alert("Inventory settings saved!");
    } catch (e) {
      console.error(e);
      alert("Error saving settings");
    }
  };

  const handleChange = (field: keyof InventorySettings, value: any) => {
    dispatch(updateInventorySettingField({ field, value }));
  };

  return (
    <div className="glass-card p-6 bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
        <span className="mr-2">⚙️</span>
        Inventory Settings
      </h2>

      <div className="space-y-4">
        {/* Low stock threshold */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Low Stock Threshold
          </label>
          <input
            type="number"
            min={1}
            value={inventorySettings.lowStockThreshold}
            onChange={(e) =>
              handleChange("lowStockThreshold", parseInt(e.target.value))
            }
            className="w-full border rounded-lg px-4 py-2
                       bg-white dark:bg-gray-800
                       border-gray-300 dark:border-gray-700
                       text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
            Products below this quantity will be flagged as low stock
          </p>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={inventorySettings.autoReorder}
              onChange={(e) =>
                handleChange("autoReorder", e.target.checked)
              }
              className="w-4 h-4 text-emerald-600
                         bg-gray-100 dark:bg-gray-800
                         border-gray-300 dark:border-gray-700
                         rounded focus:ring-emerald-500"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Auto-reorder when stock is low
            </span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={inventorySettings.emailNotifications}
              onChange={(e) =>
                handleChange("emailNotifications", e.target.checked)
              }
              className="w-4 h-4 text-emerald-600
                         bg-gray-100 dark:bg-gray-800
                         border-gray-300 dark:border-gray-700
                         rounded focus:ring-emerald-500"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Email notifications for low stock
            </span>
          </label>
        </div>

        {/* Backup frequency */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Backup Frequency
          </label>
          <select
            value={inventorySettings.backupFrequency}
            onChange={(e) =>
              handleChange("backupFrequency", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-2
                       bg-white dark:bg-gray-800
                       border-gray-300 dark:border-gray-700
                       text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Save button */}
        <button
          onClick={saveInventorySettings}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg
                     hover:bg-blue-700 transition-colors duration-200"
        >
          Save Inventory Settings
        </button>
      </div>
    </div>
  );
}
