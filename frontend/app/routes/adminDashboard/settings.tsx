import { useEffect, useState } from "react";
import Papa from "papaparse";

interface Customer {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  orders_count?: number;
}

interface Order {
  order_id: number;
  name: string;
  email: string;
  order_status: string;
  order_date: string;
}

interface Product {
  product_id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface InventorySettings {
  lowStockThreshold: number;
  autoReorder: boolean;
  emailNotifications: boolean;
  backupFrequency: string;
}

function Settings() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [inventorySettings, setInventorySettings] = useState<InventorySettings>({
    lowStockThreshold: 10,
    autoReorder: false,
    emailNotifications: true,
    backupFrequency: "weekly"
  });

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, orderRes, productRes] = await Promise.all([
          fetch("http://localhost:3000/api/orders/all-customers"),
          fetch("http://localhost:3000/api/orders/all"),
          fetch("http://localhost:3000/api/products/get"),
        ]);

        const [custData, orderData, productData] = await Promise.all([
          custRes.json(),
          orderRes.json(),
          productRes.json(),
        ]);

        setCustomers(custData.customers || []);
        setOrders(orderData.orders || []);
        setProducts(productData.products || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Dark mode is handled globally in app/root.tsx via navbar toggle

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:3000/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      alert("Profile updated!");
    } catch (e) {
      console.log(e);
      alert("Error updating profile");
    }
  };

  const saveInventorySettings = async () => {
    try {
      // In a real app, this would save to backend
      localStorage.setItem('inventorySettings', JSON.stringify(inventorySettings));
      alert("Inventory settings saved!");
    } catch (e) {
      console.log(e);
      alert("Error saving settings");
    }
  };

  const downloadCSV = (data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const backupDatabase = async () => {
    try {
      // In a real app, this would trigger a database backup
      const backupData = {
        customers,
        orders,
        products,
        timestamp: new Date().toISOString(),
        settings: inventorySettings
      };
      
      downloadCSV([backupData], `inventory-backup-${new Date().toISOString().split('T')[0]}.json`);
      alert("Database backup created!");
    } catch (error) {
      console.error("Error creating backup:", error);
      alert("Error creating backup");
    }
  };

  const lowStockProducts = products.filter(p => p.quantity < inventorySettings.lowStockThreshold);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 border-l-4 border-l-blue-500">
          <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
          <div className="text-sm text-gray-600">Total Customers</div>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-green-500">
          <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-purple-500">
          <div className="text-2xl font-bold text-gray-900">{products.length}</div>
          <div className="text-sm text-gray-600">Products</div>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-orange-500">
          <div className="text-2xl font-bold text-gray-900">${totalInventoryValue.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Inventory Value</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          

          {/* Profile Settings */}
          <div id="profile" className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
              <span className="mr-2">👤</span>
              Profile Settings
            </h2>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                Update Profile
              </button>
            </form>
          </div>

          {/* Inventory Settings */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
              <span className="mr-2">⚙️</span>
              Inventory Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  value={inventorySettings.lowStockThreshold}
                  onChange={(e) => setInventorySettings(prev => ({...prev, lowStockThreshold: parseInt(e.target.value)}))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Products below this quantity will be flagged as low stock
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    checked={inventorySettings.autoReorder}
                    onChange={(e) => setInventorySettings(prev => ({...prev, autoReorder: e.target.checked}))}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">Auto-reorder when stock is low</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    checked={inventorySettings.emailNotifications}
                    onChange={(e) => setInventorySettings(prev => ({...prev, emailNotifications: e.target.checked}))}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">Email notifications for low stock</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backup Frequency
                </label>
                <select
                  value={inventorySettings.backupFrequency}
                  onChange={(e) => setInventorySettings(prev => ({...prev, backupFrequency: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <button 
                onClick={saveInventorySettings}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Save Inventory Settings
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Low Stock Alerts */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
              <span className="mr-2">⚠️</span>
              Low Stock Alerts
            </h2>
            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.product_id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div>
                      <div className="font-medium text-red-800">{product.name}</div>
                      <div className="text-sm text-red-600">Only {product.quantity} left in stock</div>
                    </div>
                    <span className="text-red-600 font-medium">${product.price}</span>
                  </div>
                ))}
                {lowStockProducts.length > 5 && (
                  <div className="text-center text-sm text-gray-500">
                    And {lowStockProducts.length - 5} more products...
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <div className="text-2xl mb-2">✅</div>
                <div>All products are well stocked!</div>
              </div>
            )}
          </div>

          {/* Data Export */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
              <span className="mr-2">📊</span>
              Data Export
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => downloadCSV(customers, "customers.csv")}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Export Customers CSV
              </button>
              
              <button
                onClick={() => downloadCSV(orders, "orders.csv")}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Export Orders CSV
              </button>
              
              <button
                onClick={() => downloadCSV(products, "products.csv")}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Export Products CSV
              </button>
            </div>
          </div>

          {/* System Backup */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
              <span className="mr-2">💾</span>
              System Backup
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Create a complete backup of your inventory system including all data and settings.
              </p>
              <button
                onClick={backupDatabase}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
              >
                Create System Backup
              </button>
              
              <div className="text-xs text-gray-500">
                Last backup: {inventorySettings.backupFrequency}
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
              <span className="mr-2">ℹ️</span>
              System Information
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Database Version:</span>
                <span className="font-medium">v1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Storage Used:</span>
                <span className="font-medium">2.4 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Update:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
