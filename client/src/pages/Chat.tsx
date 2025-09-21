import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getToken } from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type JWTPayload = {
  userId: string;
  username: string;
  role: string;
};

type Message = {
  username?: string;
  role?: string;
  text: string;
  system?: boolean;
};

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState<JWTPayload | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const stored = localStorage.getItem("user");
  const parsed = stored ? JSON.parse(stored) : {};
  const role: string | null = parsed.role || null;
  
    const menuPaths: Record<string, string> = {
    admin: "/admin-menu",
    dispatcher: "/dispatcher-menu",
    responder: "/responder-menu",
    reporter: "/reporter-menu",
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = jwtDecode<JWTPayload>(token);
    setCurrentUser(decoded);

    const socket = io("http://localhost:5000", {
      auth: { token }
    });
    socketRef.current = socket;

    socket.on("chat history", (history: Message[]) => {
      setMessages(history);
    });

    socket.on("chat message", (m: Message) =>
      setMessages((prev) => [...prev, m])
    );

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const s = socketRef.current;
    if (!s || !input.trim() || !currentUser) return;

    s.emit("chat message", {
      text: input.trim(),
      username: currentUser.username,
      role: currentUser.role
    });
    setInput("");
  };


  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-blue-100">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          
      <button
        onClick={() => navigate(role ? menuPaths[role] : "/login")}
        className="mb-4 ml-4 mt-4 self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>
      <h1 className="text-2xl font-bold text-center">Group Chat</h1>
        </div>

        <div className="h-96 overflow-y-auto bg-white p-3 rounded shadow">
          {messages.map((m, i) => (
            <div key={i} className="mb-2">
              {m.system ? (
                <div className="text-center text-sm text-gray-500">{m.text}</div>
              ) : (
                <div>
                  <strong>{m.username}</strong>
                  {m.role && <span className="text-gray-500"> ({m.role})</span>}
                  : <span>{m.text}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={send} className="flex mt-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-l"
            placeholder="Type message..."
          />
          <button className="p-2 bg-blue-500 text-white rounded-r">Send</button>
        </form>
      </div>
    </div>
  );
}




