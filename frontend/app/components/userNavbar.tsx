import NotificationIcon from "~/Icons/userIcons/NotificationIcon";
import SearchIcon from "~/Icons/userIcons/SearchIcon";
import NotificationBell from "./ui/NotificationBell";
import { useAppSelector } from "src/store/hooks";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ModeToggle } from "./ui/mode-toggle";

function UserNavbar() {
  const user = useAppSelector((s) => s.auth.user);
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "U";
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      {/* Header/Navbar */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Overview
              </h2>
            </div>


            {/* Right: Notifications + Profile */}
            <div className="flex items-center space-x-3">

               <ModeToggle/>
                    
                
              <NotificationBell />

              {/* User Avatar */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setOpenProfile((o) => !o)}
                  className="w-8 h-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-700 dark:to-purple-900 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {initial}
                    </span>
                  </div>
                </button>

                {openProfile && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        Signed in as
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {user?.email ?? "user"}
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => {
                          setOpenProfile(false);
                          navigate("/user/profile");
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-md
                                   hover:bg-gray-50 dark:hover:bg-gray-700
                                   text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
                      >
                        <span>👤</span>
                        <span>Update Profile</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default UserNavbar;
