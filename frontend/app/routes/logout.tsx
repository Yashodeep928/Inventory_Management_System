
import { Navigate } from "react-router";
import { logout } from "src/store/authSlice"; 
import { useAppDispatch } from "src/store/hooks";
import { useEffect } from "react";



function Logout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return <Navigate to="/" replace />;
}

export default Logout;