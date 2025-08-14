// lib/auth.js
export const USER_KEY = "currentUser";

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function loginUser(username, _password) {
  // Accept any username/password for assignment simplicity
  const user = { username: username.trim() };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // Broadcast to other tabs/components
  window.dispatchEvent(new StorageEvent("storage", { key: USER_KEY, newValue: JSON.stringify(user) }));
  return user;
}

export function logoutUser() {
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new StorageEvent("storage", { key: USER_KEY, newValue: null }));
}
