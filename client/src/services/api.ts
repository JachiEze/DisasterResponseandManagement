export const API_URL = "http://localhost:5000";

export async function signup(username: string, email: string, password: string, role: string) {
  const res = await fetch(`${API_URL}/api/auth/signup`, { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, role }),
  });
  return res.json();
}

export async function login(emailOrUsername: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrUsername, password })
  });
  return res.json();
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}
export function getToken() {
  return localStorage.getItem("token");
}
export function clearToken() {
  localStorage.removeItem("token");
}

export async function logoutRequest() {
  const token = getToken();
  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
}