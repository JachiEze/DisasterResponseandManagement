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
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <button
          onClick={() => navigate(role ? menuPaths[role] : "/login")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition mb-8"
        >
          ← Back to Menu
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Disasters
        </h1>

        <div className="grid gap-6">
          {approved.map((d) => (
            <div
              key={d._id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <p className="text-xl font-semibold text-gray-900">{d.address}</p>
              <p className="mt-2 text-gray-700">{d.description}</p>
              {d.imageUrl && (
                <img
                  src={`http://localhost:5000${d.imageUrl}`}
                  alt="disaster"
                  className="mt-4 w-full rounded-lg"
                />
              )}
              <p className="text-sm text-gray-500 mt-2">
                {new Date(d.createdAt).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>

              <p className="mt-4">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={
                    d.status === "Ongoing"
                      ? "text-red-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {d.status}
                </span>
              </p>

              {(role === "dispatcher" || role === "responder") && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => changeStatus(d._id, "Resolved")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg transition"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => changeStatus(d._id, "Ongoing")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg transition"
                  >
                    Mark Ongoing
                  </button>
                </div>
              )}

              <p className="mt-4">
                <span className="font-semibold">People on scene:</span>{" "}
                {d.peopleOnScene?.length
                  ? d.peopleOnScene.join(", ")
                  : "None"}
              </p>

              {role === "responder" && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => joinScene(d._id)}
                    disabled={d.peopleOnScene?.includes(username || "")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-lg transition disabled:opacity-50"
                  >
                    At the scene
                  </button>
                  <button
                    onClick={() => leaveScene(d._id)}
                    disabled={!d.peopleOnScene?.includes(username || "")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-lg transition disabled:opacity-50"
                  >
                    Left the scene
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




