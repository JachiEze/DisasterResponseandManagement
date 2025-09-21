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
    const data = await res.json();
    setUsers(data);
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

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/admin-menu")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>

        
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-64"
        />
      </div>

      <h1 className="text-2xl font-bold text-center mb-4">Account Management</h1>

      {filtered.map((u) => (
        <div
          key={u._id}
          className="bg-white p-4 mb-3 rounded shadow flex flex-col sm:flex-row sm:justify-between items-start sm:items-center w-full max-w-2xl"
        >
          <div className="space-y-1">
            <p>
              <strong>{u.username}</strong> ({u.role})
              {u.approved && (
                <span className="ml-2 text-green-600 font-semibold">Approved</span>
              )}
            </p>
            <p>Email: {u.email}</p>
            <p>Phone: {u.phone}</p>
            <p>Security Question 1: {u.securityQuestion1}</p>
            <p>Answer 1: {u.securityAnswer1}</p>
            <p>Security Question 2: {u.securityQuestion2}</p>
            <p>Answer 2: {u.securityAnswer2}</p>

            {u.idImageUrl && (
              <img
                src={`http://localhost:5000${u.idImageUrl}`}
                alt="User ID"
                className="mt-2 w-48 rounded border"
              />
            )}
          </div>

          {!u.approved && (
            <div className="space-x-2 mt-3 sm:mt-0">
              <button
                onClick={() => approve(u._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => reject(u._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}





