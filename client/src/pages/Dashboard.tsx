import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Disaster {
  _id: string;
  address: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  status: "Ongoing" | "Resolved";
  peopleOnScene: string[];           
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [approved, setApproved] = useState<Disaster[]>([]);
  const token = localStorage.getItem("token");
  const stored = localStorage.getItem("user");
  const parsed = stored ? JSON.parse(stored) : {};
  const role: string | null = parsed.role || null;
  const username: string | null = parsed.username || null; 

  const menuPaths: Record<string, string> = {
    admin: "/admin-menu",
    dispatcher: "/dispatcher-menu",
    responder: "/responder-menu",
    reporter: "/reporter-menu",
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/disasters/approved", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setApproved(res.data))
      .catch(console.error);
  }, []);

  
  const changeStatus = async (id: string, newStatus: "Ongoing" | "Resolved") => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/disasters/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApproved((prev) =>
        prev.map((d) => (d._id === id ? { ...d, status: res.data.status } : d))
      );
    } catch (err) {
      console.error(err);
    }
  };

  
  const joinScene = async (id: string) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/disasters/${id}/scene/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApproved((prev) =>
        prev.map((d) =>
          d._id === id ? { ...d, peopleOnScene: res.data.peopleOnScene } : d
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  
  const leaveScene = async (id: string) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/disasters/${id}/scene/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApproved((prev) =>
        prev.map((d) =>
          d._id === id ? { ...d, peopleOnScene: res.data.peopleOnScene } : d
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <button
        onClick={() => navigate(role ? menuPaths[role] : "/login")}
        className="mb-4 ml-4 mt-4 self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>

      <h1 className="text-2xl font-bold text-center">Disasters</h1>

      <div className="grid gap-4">
        {approved.map((d) => (
          <div key={d._id} className="bg-white p-4 rounded shadow">
            <p className="font-bold">{d.address}</p>
            <p>{d.description}</p>
            <img
              src={`http://localhost:5000${d.imageUrl}`}
              alt="disaster"
              className="mt-2 w-full rounded"
            />
            <p className="text-sm text-gray-500">
              {new Date(d.createdAt).toLocaleString()}
            </p>

            
            <p className="mt-2">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={
                  d.status === "Ongoing" ? "text-red-600" : "text-green-600"
                }
              >
                {d.status}
              </span>
            </p>

            
            {(role === "dispatcher" || role === "responder") && (
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => changeStatus(d._id, "Resolved")}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Mark Resolved
                </button>
                <button
                  onClick={() => changeStatus(d._id, "Ongoing")}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Mark Ongoing
                </button>
              </div>
            )}

            
            <p className="mt-3">
              <span className="font-semibold">People on the scene:</span>{" "}
              {d.peopleOnScene && d.peopleOnScene.length > 0
                ? d.peopleOnScene.join(", ")
                : "None"}
            </p>

            
            {role === "responder" && (
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => joinScene(d._id)}
                  disabled={d.peopleOnScene?.includes(username || "")}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  At the scene
                </button>
                <button
                  onClick={() => leaveScene(d._id)}
                  disabled={!d.peopleOnScene?.includes(username || "")}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                >
                  Left the scene
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}



