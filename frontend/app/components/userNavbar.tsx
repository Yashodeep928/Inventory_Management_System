import NotificationIcon from "~/Icons/userIcons/NotificationIcon";
import SearchIcon from "~/Icons/userIcons/SearchIcon";
import NotificationBell from "./ui/NotificationBell";
function UserNavbar() {
  return (
     
    <>
    
     {/* Header or Navbar starts */}

        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <SearchIcon />
            </div>
            <NotificationBell />
          </div>
        </header>

        {/* Header or Navbar ends */}
    
    
    
    </>





  )
}

export default UserNavbar