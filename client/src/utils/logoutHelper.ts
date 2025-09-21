import { getToken, clearToken } from "../services/api";

export async function handleLogout(navigate: (path: string) => void) {
  await fetch("http://localhost:5000/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    }
  });

  clearToken();
  navigate("/login");
}
