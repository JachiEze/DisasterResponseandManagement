import { useState } from "react";
import { login, setToken } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type JWTPayload = {
  userId: string;
  username: string;
  role: string;
};

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const data = await login(emailOrUsername, password);

    if (data.token) {
      setToken(data.token);

      
      const decoded = jwtDecode<JWTPayload>(data.token);
      const role = decoded.role;

      localStorage.setItem("user", JSON.stringify(decoded));

      
      switch (role) {
        case "admin":
          navigate("/admin-menu");
          break;
        case "reporter":
          navigate("/reporter-menu");
          break;
        case "dispatcher":
          navigate("/dispatcher-menu");
          break;
        case "responder":
          navigate("/responder-menu");
          break;
        default:
          navigate("/login");
      }
    } else {
      setError(data.message || "❌ Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <form
        onSubmit={submit}
        className="p-6 bg-white rounded shadow w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <p className="mb-3 text-center text-red-600">{error}</p>}
        <input
          className="w-full p-2 mb-2 border"
          placeholder="Email or Username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
        />
        <input
          className="w-full p-2 mb-4 border"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded mb-3">
          Login
        </button>
        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}



