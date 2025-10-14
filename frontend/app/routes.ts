import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  route("/", "routes/home.tsx"),

  // Public pages
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  route("/logout", "routes/logout.tsx"),


   // Admin dashboard (protected)
  route("dashboard", "routes/adminDashboard/ProtectedAdminLayout.tsx", [
    index("routes/adminDashboard/adminDashboard.tsx"),
    route("products", "routes/adminDashboard/addProduct.tsx"),
    route("customers", "routes/adminDashboard/customers.tsx"),
    route("orders", "routes/adminDashboard/orders.tsx"),
    route("settings", "routes/adminDashboard/settings.tsx"),
  ]),


  // User dashboard layout
  route("user", "routes/userDashboard/ProtectedUserLayout.tsx", [
    index("routes/userDashboard/userDashboard.tsx"),   // /user → dashboard
    route("orders", "routes/userDashboard/Orders.tsx"), // /user/orders
    route("profile", "routes/userDashboard/Profile.tsx"), // /user/profile
  ]),

] satisfies RouteConfig;
