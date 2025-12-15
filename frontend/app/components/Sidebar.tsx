import { NavLink } from "react-router";
import CustomersIcon from "../Icons/adminIcons/CustomersIcon";
import DashboardIcon from "../Icons/adminIcons/DashboardIcon";
import ProductsIcon from "../Icons/adminIcons/ProductsIcon";
import OrdersIcon from "../Icons/adminIcons/OrdersIcon";
import SettingsIcon from "../Icons/adminIcons/SettingsIcon";
import LogoutIcon from "../Icons/adminIcons/LogoutIcon";
import { useLogout } from "../routes/ProtectedRoute";

function Sidebar() {
  const logoutUser = useLogout();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col justify-between p-6 fixed">
      {/* Logo */}
      <div>
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center bg-green-700 dark:bg-green-600">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Inventory Management
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {[
            { to: "/dashboard", icon: <DashboardIcon />, label: "Dashboard" },
            { to: "/dashboard/products", icon: <ProductsIcon />, label: "Products" },
            { to: "/dashboard/customers", icon: <CustomersIcon />, label: "Customers" },
            { to: "/dashboard/orders", icon: <OrdersIcon />, label: "Orders" },
            { to: "/dashboard/settings", icon: <SettingsIcon />, label: "Settings" },
          ].map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"} 
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${
                  isActive
                    ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={logoutUser}
        className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-700"
      >
        <LogoutIcon />
        <span>Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;
