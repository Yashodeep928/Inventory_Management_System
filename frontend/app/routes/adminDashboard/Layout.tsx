import { Outlet } from "react-router";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

export default function Layout() {
  return (
    <div className="font-inter flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-50 shadow-lg z-50">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 min-h-screen">
        {/* Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <Navbar />
        </header>

        <div className="p-6">
          {/* Child routes render here */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
