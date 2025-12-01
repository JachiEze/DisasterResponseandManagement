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
    axios
      .get("http://localhost:5000/api/feedback")
      .then((res) => setFeedbacks(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <button
          onClick={() => navigate("/admin-menu")}
          className="mb-8 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          ← Back to Menu
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Website Feedback
        </h1>

        <div className="space-y-5">
          {feedbacks.map((f) => (
            <div
              key={f._id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <p className="font-semibold text-gray-900">
                {f.name} <span className="text-gray-500">({f.email})</span>
              </p>
              <p className="mt-2 text-gray-700">{f.message}</p>
              <p className="mt-2 text-sm text-gray-500">
                {new Date(f.createdAt).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


