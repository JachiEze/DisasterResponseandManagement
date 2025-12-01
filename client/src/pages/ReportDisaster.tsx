import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ReportDisaster() {
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("Please add an image");

    const formData = new FormData();
    formData.append("address", address);
    formData.append("description", description);
    formData.append("image", image);

    setLoading(true);
    try {
      await axios.post("/api/disasters", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Disaster reported!");
      setAddress("");
      setDescription("");
      setImage(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error reporting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-md mx-auto px-6">
        <div className="mb-8">
          <button
            onClick={() => navigate("/reporter-menu")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            ← Back to Menu
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Report a Disaster
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md space-y-4"
        >
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="block w-full text-gray-700"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-lg shadow transition"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}


