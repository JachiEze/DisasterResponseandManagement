import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Disaster {
  _id: string;
  address: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export default function AssessDisaster() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchDisasters = () => {
    axios.get("http://localhost:5000/api/disasters", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setDisasters(res.data))
    .catch(console.error);
  };

  useEffect(fetchDisasters, []);

  const handleAccept = (id: string) => {
    axios.put(`http://localhost:5000/api/disasters/${id}/accept`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => setDisasters(disasters.filter(d => d._id !== id)))
    .catch(console.error);
  };

  const handleReject = (id: string) => {
    axios.delete(`http://localhost:5000/api/disasters/${id}/reject`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => setDisasters(disasters.filter(d => d._id !== id)))
    .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <button
        onClick={() => navigate("/dispatcher-menu")}
        className="mb-4 ml-4 mt-4 self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>
      <h1 className="text-2xl font-bold text-center">Reported Disasters</h1>
      <div className="grid gap-4">
        {disasters.map(d => (
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
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleAccept(d._id)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(d._id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


