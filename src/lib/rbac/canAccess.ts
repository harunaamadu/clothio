import { Role } from "./roles";
import { routeAccess } from "./routes";

export function canAccess(pathname: string, role?: Role): boolean {
  if (!role) return false;

  const matchedRoute = Object.keys(routeAccess).find((route) =>
    pathname.startsWith(route),
  );

  if (!matchedRoute) return true; // public route

  return routeAccess[matchedRoute].includes(role);
}