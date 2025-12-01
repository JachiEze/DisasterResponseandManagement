import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Resource {
  _id: string;
  name: string;
  quantity: number;
  location: string;
}

export default function Resources() {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  async function fetchResources() {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get("/api/resources", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      setResources([]);
    }
  }

  useEffect(() => {
    fetchResources();
  }, []);

  async function addResource() {
    try {
      await axios.post(
        "/api/resources",
        { name, quantity, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setQuantity(0);
      setLocation("");
      fetchResources();
    } catch (err) {
      console.error("Failed to add resource:", err);
    }
  }

  async function updateResource(id: string, updates: Partial<Resource>) {
    try {
      await axios.put(`/api/resources/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchResources();
    } catch (err) {
      console.error("Failed to update resource:", err);
    }
  }

  async function deleteResource(id: string) {
    try {
      await axios.delete(`/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchResources();
    } catch (err) {
      console.error("Failed to delete resource:", err);
    }
  }

  const filteredResources = resources.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/admin-menu")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            ← Back to Menu
          </button>

          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Manage Resources
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2 w-28"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
          />
          <button
            onClick={addResource}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition"
          >
            Add
          </button>
        </div>

        <ul className="space-y-4">
          {filteredResources.map((r) => (
            <li
              key={r._id}
              className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <div className="font-semibold text-gray-900">
                {r.name} — {r.quantity} — {r.location}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const input = prompt(
                      `Set new quantity for ${r.name}:`,
                      r.quantity.toString()
                    );
                    if (input && !Number.isNaN(Number(input))) {
                      updateResource(r._id, { quantity: Number(input) });
                    }
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition"
                >
                  Edit Qty
                </button>
                <button
                  onClick={() => {
                    const input = prompt(
                      `Set new location for ${r.name}:`,
                      r.location
                    );
                    if (input && input.trim()) {
                      updateResource(r._id, { location: input.trim() });
                    }
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition"
                >
                  Edit Loc
                </button>
                <button
                  onClick={() => deleteResource(r._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}






