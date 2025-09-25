import { type ReactNode, createContext, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "src/store/store";
import { logout } from "src/store/authSlice";
import { Navigate } from "react-router";

interface Props {
  children: ReactNode;
  role: "user" | "admin";
}

// Create context for logout functionality
const LogoutContext = createContext<(() => void) | null>(null);

export const useLogout = () => {
  const logoutFn = useContext(LogoutContext);
  if (!logoutFn) {
    throw new Error("useLogout must be used within a ProtectedRoute");
  }
  return logoutFn;
};

export default function ProtectedRoute({ children, role }: Props) {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  // Handle logout function
  const handleLogout = () => {
    dispatch(logout());
  };

  // Check authentication
  if (!auth.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check role authorization
  if (auth.userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return (
    <LogoutContext.Provider value={handleLogout}>
      {children}
    </LogoutContext.Provider>
  );
}
