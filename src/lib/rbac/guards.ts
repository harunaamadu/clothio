import { Role } from "./roles";

export function isAuthenticated(user: any): boolean {
  return !!user;
}

export function isAdmin(role?: Role) {
  return role === "admin";
}