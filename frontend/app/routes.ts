// app/routes.ts
import { type RouteConfig, route } from "@react-router/dev/routes";
import Root from "./root"; // <-- root is the App/Provider wrapper

export default [
  route("/", "routes/home.tsx"), // root wraps all child routes

  // Public pages
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),

  // Protected dashboards
  route("/user/dashboard", "routes/user.dashboard.tsx"),
  route("/admin/dashboard", "routes/admin.dashboard.tsx"),
] satisfies RouteConfig;
