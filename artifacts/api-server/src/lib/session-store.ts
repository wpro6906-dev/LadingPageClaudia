import crypto from "crypto";

interface AdminSession { adminId: number; username: string }
interface UserSession { username: string }

const adminSessions = new Map<string, AdminSession>();
const userSessions = new Map<string, UserSession>();

export function createAdminSession(data: AdminSession): string {
  const token = crypto.randomBytes(32).toString("hex");
  adminSessions.set(token, data);
  return token;
}
export function getAdminSession(token: string): AdminSession | null {
  return adminSessions.get(token) ?? null;
}
export function deleteAdminSession(token: string): void {
  adminSessions.delete(token);
}

export function createUserSession(data: UserSession): string {
  const token = crypto.randomBytes(32).toString("hex");
  userSessions.set(token, data);
  return token;
}
export function getUserSession(token: string): UserSession | null {
  return userSessions.get(token) ?? null;
}
export function deleteUserSession(token: string): void {
  userSessions.delete(token);
}
