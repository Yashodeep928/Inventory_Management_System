import ProtectedRoute from "~/routes/ProtectedRoute";
import Layout from "./Layout";

/**
 * ProtectedAdminLayout
 * Wraps the entire admin Layout with ProtectedRoute so the
 * LogoutContext and auth checks apply to sidebar, navbar & child pages.
 */
export default function ProtectedAdminLayout() {
  return (
    <ProtectedRoute role="admin">
      <Layout />
    </ProtectedRoute>
  );
}
