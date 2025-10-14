import { NavLink } from "react-router";
import CustomersIcon from "../Icons/adminIcons/CustomersIcon";
import DashboardIcon from "../Icons/adminIcons/DashboardIcon";
import ProductsIcon from "../Icons/adminIcons/ProductsIcon";
import OrdersIcon from "../Icons/adminIcons/OrdersIcon";
import SettingsIcon from "../Icons/adminIcons/SettingsIcon";
import LogoutIcon from "../Icons/adminIcons/LogoutIcon";
import { useLogout } from "../routes/ProtectedRoute"; // ✅ import hook

function Sidebar() {
  const logoutUser = useLogout(); // ✅ get logout function

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col justify-between p-6 fixed">
      {/* Logo */}
      <div>
        <div className="flex items-center space-x-3 mb-8">
          <div
            className="w-8 h-8 rounded-sm flex items-center justify-center"
            style={{ backgroundColor: "#00A86B" }}
          >
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <h1 className="text-lg font-semibold text-gray-800">
            Inventory Management
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/dashboard/products"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <ProductsIcon />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/dashboard/customers"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <CustomersIcon />
            <span>Customers</span>
          </NavLink>

          <NavLink
            to="/dashboard/orders"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <OrdersIcon />
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <SettingsIcon />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={logoutUser} // ✅ call logout function
        className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <LogoutIcon />
        <span>Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;
