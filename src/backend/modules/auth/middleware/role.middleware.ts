import type { AuthRole } from "../auth.types";

export const moduleRoutes: Record<AuthRole, string> = {
  Admin: "/admin",
  Barbero: "/barbero",
  Cliente: "/cliente",
};

export function resolveModuleRoute(selectedModule: AuthRole): string | null {
  return moduleRoutes[selectedModule] ?? null;
}


export function canAccessModule(userRole: AuthRole, requiredRole: AuthRole): boolean {
    
  return userRole === requiredRole;
}