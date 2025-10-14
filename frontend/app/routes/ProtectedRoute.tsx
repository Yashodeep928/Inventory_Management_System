import { useEffect, createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "src/store/authSlice";
import { type RootState } from "src/store/store";

// ------------------- Context & Hook -------------------
export const LogoutContext = createContext<() => void>(() => {});

// Custom hook to use logout function in any child component
export const useLogout = () => useContext(LogoutContext);

// ------------------- ProtectedRoute Component -------------------
type Props = {
  children: React.ReactNode;
  role: string; // "admin" | "user"
};

export default function ProtectedRoute({ children, role }: Props) {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // ------------------- Redirect logic -------------------
  useEffect(() => {
    if (!auth.isLoggedIn || auth.role !== role) {
      navigate("/login", { replace: true });
    }
  }, [auth.isLoggedIn, auth.role, navigate, role]);

  // ------------------- Logout handler -------------------
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true }); // Ensure user is redirected after logout
  };

  // Don't render children if not logged in or role doesn't match
  if (!auth.isLoggedIn || auth.role !== role) return null;

  return (
    <LogoutContext.Provider value={handleLogout}>
      {children}
    </LogoutContext.Provider>
  );
}
