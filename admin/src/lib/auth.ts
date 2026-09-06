export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  token?: string;
}

const STORAGE_KEY = "matri_shakti_admin_user";

export function getStoredUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("admin_user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: AdminUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem("admin_user", JSON.stringify(user));
  if (user.token) {
    localStorage.setItem("admin_token", user.token);
  }
}

export function clearStoredUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_token");
  } catch {
    // Ignore in private browsing
  }
}

export function isUserLoggedIn(): boolean {
  try {
    const token = localStorage.getItem("admin_token");
    if (!token || token.trim() === "" || token === "undefined" || token === "null") {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
