import SearchIcon from "../Icons/adminIcons/SearchIcon"
import NotificationBell from "../components/ui/NotificationBell"
import { useAppSelector } from "src/store/hooks"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router"
import { Moon, Sun } from "lucide-react";

function Navbar() {
  const user = useAppSelector((s) => s.auth.user)
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "A"
  const [openProfile, setOpenProfile] = useState(false)
  const navigate = useNavigate()
  const profileRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false)
      }
    }
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [])
  return (
    <>

     <div className="px-6 py-4">
           <div className="flex items-center justify-between">
             {/* Left: Title */}
             <div>
               <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
             </div>

             {/* Center: Search */}
             <div className="flex-1 flex justify-center px-4">
               <div className="relative w-full max-w-xl">
                 <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                   <SearchIcon />
                 </span>
                 <input
                   type="text"
                   placeholder="Search..."
                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-green-500 bg-white"
                 />
               </div>
             </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications Dropdown */}
              <NotificationBell />
               {/* User Avatar */}
               <div className="relative" ref={profileRef}>
                 <button
                   onClick={() => setOpenProfile((o) => !o)}
                   className="w-8 h-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                 >
                   <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                     <span className="text-white text-sm font-medium">{initial}</span>
                   </div>
                 </button>

                 {openProfile && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                     <div className="px-4 py-3 border-b border-gray-100">
                       <div className="text-sm text-gray-500">Signed in as</div>
                      <div className="text-sm font-medium text-gray-900 truncate">{user?.email ?? "admin"}</div>
                     </div>

                    <div className="p-2">
                      {/* Profile Settings link */}
                       <button
                         onClick={() => { setOpenProfile(false); navigate('/dashboard/settings#profile'); }}
                         className="w-full flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-50 text-sm text-gray-700 cursor-pointer dark:text-gray-600"
                       >
                         <span>👤</span>
                         <span>Profile Settings</span>
                       </button>
                     </div>

                    <div className="p-2 border-t border-gray-100">
                       <button
                         onClick={() => { setOpenProfile(false); navigate('/dashboard/settings'); }}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm text-gray-700 cursor-pointer"
                       >
                         Open Settings
                       </button>
                     </div>
                   </div>
                 )}
               </div>
             </div>
           </div>
          </div>
    
    
    </>
  )
}

export default Navbar

