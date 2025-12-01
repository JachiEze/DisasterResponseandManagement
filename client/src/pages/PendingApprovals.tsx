import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/api";

interface PendingUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  phone: string;
  securityQuestion1: string;
  securityAnswer1: string;
  securityQuestion2: string;
  securityAnswer2: string;
  approved: boolean;
  idImageUrl?: string;
}

export default function PendingApprovals() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setUsers(await res.json());
  };

  const approve = async (id: string) => {
    await fetch(`http://localhost:5000/api/admin/approve/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    fetchUsers();
  };

  const reject = async (id: string) => {
    await fetch(`http://localhost:5000/api/admin/reject/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
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
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Account Management
        </h1>

        <div className="space-y-6">
          {filtered.map((u) => (
            <div
              key={u._id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div className="space-y-1 text-gray-700">
                <p className="font-semibold text-gray-900">
                  {u.username}{" "}
                  <span className="text-sm text-gray-500">({u.role})</span>
                  {u.approved && (
                    <span className="ml-2 text-green-600 font-semibold">
                      Approved
                    </span>
                  )}
                </p>
                <p>Email: {u.email}</p>
                <p>Phone: {u.phone}</p>
                <p>Security Q1: {u.securityQuestion1}</p>
                <p>Answer 1: {u.securityAnswer1}</p>
                <p>Security Q2: {u.securityQuestion2}</p>
                <p>Answer 2: {u.securityAnswer2}</p>

                {u.idImageUrl && (
                  <img
                    src={`http://localhost:5000${u.idImageUrl}`}
                    alt="User ID"
                    className="mt-3 w-48 rounded-lg border"
                  />
                )}
              </div>

              {!u.approved && (
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => approve(u._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(u._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Reject
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






