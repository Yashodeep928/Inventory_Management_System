import LogoutIcon from "~/Icons/userIcons/LogoutIcon";
import DashboardIcon from "~/Icons/userIcons/DashboardIcon";
import OrdersIcon from "~/Icons/userIcons/OrdersIcon";
import ProfileIcon from "~/Icons/userIcons/ProfileIcon";
import { NavLink } from "react-router";
import { useLogout } from "~/routes/ProtectedRoute";

function UserNavbar() {
  const logoutUser = useLogout();

  return (
    <>
      {/* Sidebar starts */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50">
        <div className="p-6 h-full flex flex-col justify-between">
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
              <NavLink
                to="/user"
                end
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${
                    isActive
                      ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <DashboardIcon />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/user/orders"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${
                    isActive
                      ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <OrdersIcon />
                <span>Orders</span>
              </NavLink>

              <NavLink
                to="/user/profile"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${
                    isActive
                      ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <ProfileIcon />
                <span>Profile</span>
              </NavLink>
            </nav>
          </div>

          {/* Logout Button */}
          <button
            onClick={logoutUser}
            type="button"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-700"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      {/* Sidebar ends */}
    </>
  );
}

export default UserNavbar;
