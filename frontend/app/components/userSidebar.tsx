
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


      <aside className="fixed left-0 top-0 h-full w-64 shadow-lg bg-gray-50 z-50">
        <div className="p-6">
          <h1 className="text-lg font-semibold mb-8">My Account</h1>

          <nav className="space-y-2">
            <NavLink to="/user" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
              <DashboardIcon /><span>Dashboard</span>
            </NavLink>
            <NavLink to="/user/orders" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
              <OrdersIcon /><span>Orders</span>
            </NavLink>
            <NavLink to="/user/profile" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
              <ProfileIcon /><span>Profile</span>
            </NavLink>
          </nav>

           
      {/* Logout Button */}
      <button
        onClick={logoutUser} // ✅ call logout function
        className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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