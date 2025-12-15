import { Outlet } from "react-router";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

export default function Layout() {
  return (
   <div className="font-inter flex min-h-screen bg-gray-100 dark:bg-gray-900">
  <aside className="fixed left-0 top-0 h-full w-64 bg-gray-50 dark:bg-gray-800 shadow-lg z-50">
    <Sidebar />
  </aside>

  <main className="ml-64 flex-1 min-h-screen bg-gray-100 dark:bg-gray-900">
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <Navbar />
    </header>
    <div className="p-6">
      <Outlet />
    </div>
  </main>
</div>

  );
}
