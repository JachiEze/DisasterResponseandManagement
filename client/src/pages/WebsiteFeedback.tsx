import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Feedback {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function WebsiteFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/feedback")
      .then(res => setFeedbacks(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-blue-100 p-6">
            <button
        onClick={() => navigate("/admin-menu")}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>
      <h1 className="text-2xl font-bold mb-4 text-center">Website Feedback</h1>
      <div className="max-w-2xl mx-auto space-y-4">
        {feedbacks.map(f => (
          <div key={f._id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">{f.name} ({f.email})</p>
            <p className="mt-1 text-gray-700">{f.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(f.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

