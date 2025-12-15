import { Outlet } from "react-router";
import UserNavbar from "../../components/userNavbar";
import UserSidebar from "../../components/userSidebar";

export default function UserLayout() {
  return (
    <div className="font-inter min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main content */}
      <main className="ml-64 min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Top Navbar */}
        <UserNavbar />

        {/* Page Content */}
        <div className="p-6 text-gray-900 dark:text-gray-100">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
