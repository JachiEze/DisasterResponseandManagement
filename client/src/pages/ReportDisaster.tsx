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
    <div className="relative min-h-screen bg-blue-100 flex items-center justify-center">
      {/* absolutely positioned top-left button */}
      <button
        onClick={() => navigate("/reporter-menu")}
        className="absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Report a Disaster</h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

