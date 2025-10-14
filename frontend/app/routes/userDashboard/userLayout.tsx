import { Outlet } from "react-router";


import UserNavbar from "../../components/userNavbar";
import UserSidebar from "../../components/userSidebar";
export default function UserLayout() {

  return (
    <div className="font-inter" style={{ backgroundColor: "#F5F5F5" }}>

         <UserSidebar />
      {/* Main content starts */}


      <main className="ml-64 min-h-screen bg-gray-50">


      <UserNavbar />
       





        {/* Our portion starts */}

        <div className="p-6">

          <Outlet /> {/* renders child routes like dashboard, orders, profile */}

        </div>

       {/* Our portion ends */}




      </main>

      {/* Main content ends */}

    </div>
  );
}
