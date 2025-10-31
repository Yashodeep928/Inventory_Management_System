
import LogoutIcon from "~/Icons/userIcons/LogoutIcon";
import DashboardIcon from "~/Icons/userIcons/DashboardIcon";
import OrdersIcon from "~/Icons/userIcons/OrdersIcon";
import ProfileIcon from "~/Icons/userIcons/ProfileIcon";
import { NavLink } from "react-router";
import { useLogout } from "~/routes/ProtectedRoute";




function userNavbar() {
  const logoutUser = useLogout();

  return (
    <>


    {/* Sidebar starts */}


      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r z-50">
        <div className="p-6 h-full flex flex-col justify-between">
          {/* Logo (match admin) */}
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

            {/* Navigation Menu (match admin active state) */}
            <nav className="space-y-2">
              <NavLink
                to="/user"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${
                    isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100"
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
                    isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100"
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
                    isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <ProfileIcon />
                <span>Profile</span>
              </NavLink>
            </nav>
          </div>

          {/* Logout Button (sticky bottom like admin) */}
          <button
            onClick={logoutUser}
            className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            type="button"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </aside>

         {/* sidebar ends */}

    
    
    
    
    </>
  )
}

export default userNavbar