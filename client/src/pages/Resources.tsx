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
  const [searchTerm, setSearchTerm] = useState(""); // NEW

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
    <div className="min-h-screen bg-blue-100 flex flex-col items-center p-6 relative">
  
      <div className="w-full flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/admin-menu")}
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

      <h1 className="text-2xl font-bold text-center mb-4">Resources</h1>

    
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border p-2 rounded w-24"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={addResource}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>

    
      <ul className="space-y-4 w-full max-w-md">
        {filteredResources.map((r) => (
          <li
            key={r._id}
            className="flex items-center justify-between bg-white p-4 rounded shadow"
          >
            <span className="font-semibold">
              {r.name} — {r.quantity} — {r.location}
            </span>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const input = prompt(
                    `Set new quantity for ${r.name}:`,
                    r.quantity.toString()
                  );
                  if (input !== null) {
                    const newQty = Number(input);
                    if (!Number.isNaN(newQty)) {
                      updateResource(r._id, { quantity: newQty });
                    }
                  }
                }}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit Qty
              </button>

              <button
                onClick={() => {
                  const input = prompt(
                    `Set new location for ${r.name}:`,
                    r.location
                  );
                  if (input !== null && input.trim() !== "") {
                    updateResource(r._id, { location: input.trim() });
                  }
                }}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Edit Location
              </button>

              <button
                onClick={() => deleteResource(r._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}





