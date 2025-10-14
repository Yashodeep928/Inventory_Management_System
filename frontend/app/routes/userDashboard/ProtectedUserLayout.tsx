import ProtectedRoute from "~/routes/ProtectedRoute";

import UserLayout from "./userLayout";


export default function ProtectedUserLayout () {

return (
 <>

  <ProtectedRoute role="user">
       <UserLayout/>
     </ProtectedRoute>
 
 </>

);

}