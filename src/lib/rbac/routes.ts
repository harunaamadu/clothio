import { Role } from "./roles";

export const routeAccess: Record<string, Role[]> = {
  "/dashboard": ["admin", "user"],
  "/admin": ["admin"],
  "/profile": ["admin", "user"],
};