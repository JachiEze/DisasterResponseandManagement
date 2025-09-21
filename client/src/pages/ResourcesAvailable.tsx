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
    <div className="min-h-screen bg-blue-100 p-6">
    
      <div className="w-full flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(role ? menuPaths[role] : "/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>

        
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-64"
        />
      </div>

      <h1 className="text-2xl font-bold text-center mb-4">
        Available Resources
      </h1>

      <ul className="space-y-3 max-w-md mx-auto">
        {filteredResources.map((r) => (
          <li
            key={r._id}
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <div className="flex flex-col">
              <span className="font-semibold">{r.name}</span>
              <span className="text-gray-600 text-sm">
                Location: {r.location}
              </span>
            </div>
            <span className="text-gray-700 font-medium">{r.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


