import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Resource {
  _id: string;
  name: string;
  quantity: number;
  location: string;
}

export default function ResourcesAvailable() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const stored = localStorage.getItem("user");
  const role = stored ? JSON.parse(stored).role : null;

  const menuPaths: Record<string, string> = {
    dispatcher: "/dispatcher-menu",
    responder: "/responder-menu",
  };

  useEffect(() => {
    axios
      .get("/api/resources", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setResources(res.data))
      .catch((err) => console.error("Failed to fetch resources:", err));
  }, []);

  const filteredResources = resources.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(role ? menuPaths[role] : "/login")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            ← Back
          </button>
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Available Resources
        </h1>

        <ul className="space-y-4">
          {filteredResources.map((r) => (
            <li
              key={r._id}
              className="flex justify-between bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <div>
                <p className="font-semibold text-gray-900">{r.name}</p>
                <p className="text-gray-600 text-sm">Location: {r.location}</p>
              </div>
              <span className="text-indigo-700 font-bold">{r.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}



