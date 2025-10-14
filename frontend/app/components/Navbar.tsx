import SearchIcon from "../Icons/adminIcons/SearchIcon"
import NotificationIcon from "../Icons/adminIcons/NotificationIcon"
import { useAppSelector } from "src/store/hooks"

function Navbar() {
  const user = useAppSelector((s) => s.auth.user)
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "A"
  return (
    <>

     <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-green-500"
                  />
                  <SearchIcon />
                </div>
                <div className="flex items-center space-x-3">
                  {/* Notification Icon */}
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer">
                    <NotificationIcon />
                  </div>
                  {/* User Avatar */}
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{initial}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    
    
    </>
  )
}

export default Navbar