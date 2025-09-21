import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("dispatcher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");                              
  const [securityQuestion1, setSecurityQuestion1] = useState("");
  const [securityAnswer1, setSecurityAnswer1] = useState("");
  const [securityQuestion2, setSecurityQuestion2] = useState("");
  const [securityAnswer2, setSecurityAnswer2] = useState("");
  const [idImage, setIdImage] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const isStrongPassword = (val: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(val);

  const isValidPhone = (val: string) =>
    /^\+?[0-9]{7,15}$/.test(val); 

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!isValidEmail(email)) {
      setMessage("❌ Please enter a valid email like name@example.com");
      return;
    }
    if (!isValidPhone(phone)) {
      setMessage("❌ Please enter a valid phone number");
      return;
    }
    if (!isStrongPassword(password)) {
      setMessage(
        "❌ Password must be at least 8 characters and include upper & lower case letters, a number, and a symbol"
      );
      return;
    }
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }
   if (
      !securityQuestion1 ||
      !securityAnswer1.trim() ||
      !securityQuestion2 ||
      !securityAnswer2.trim()
    ) {
      setMessage("❌ Please select and answer both security questions");
      return;
    }
    if (!idImage) {
      setMessage("❌ Please upload a photo of your ID");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);                          
    formData.append("securityQuestion1", securityQuestion1);
    formData.append("securityAnswer1", securityAnswer1);
    formData.append("securityQuestion2", securityQuestion2);
    formData.append("securityAnswer2", securityAnswer2);       
    formData.append("password", password);
    formData.append("role", role);
    formData.append("idImage", idImage);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "✅ Signup successful! Await admin approval.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "❌ Signup failed");
      }
    } catch {
      setMessage("❌ Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <form
        onSubmit={submit}
        className="p-6 bg-white rounded shadow w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Sign up</h2>
        {message && <p className="mb-3 text-center">{message}</p>}

        <input
          className="w-full p-2 mb-2 border"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full p-2 mb-2 border"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

    
        <input
          className="w-full p-2 mb-2 border"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="w-full p-2 mb-2 border"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="w-full p-2 mb-4 border"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

      
      <label className="block mb-1 font-medium">Security Question 1:</label>
        <select
          className="w-full p-2 mb-2 border rounded"
          value={securityQuestion1}
          onChange={(e) => setSecurityQuestion1(e.target.value)}
        >
          <option value="">-- Select a question --</option>
          <option>What is the middle name of your oldest sibling?</option>
          <option>In what city or town did your parents meet?</option>
          <option>What was the name of your first stuffed animal?</option>
          <option>What was the first concert you attended?</option>
          <option>What was the make and model of your first car?</option>
          <option>What was the name of the street you grew up on?</option>
          <option>What was the name of your elementary school?</option>
          <option>What year did you graduate high school?</option>
        </select>

        <input
          className="w-full p-2 mb-4 border"
          placeholder="Your Answer"
          value={securityAnswer1}
          onChange={(e) => setSecurityAnswer1(e.target.value)}
        />

        <label className="block mb-1 font-medium">Security Question 2:</label>
        <select
          className="w-full p-2 mb-2 border rounded"
          value={securityQuestion2}
          onChange={(e) => setSecurityQuestion2(e.target.value)}
        >
          <option value="">-- Select a question --</option>
          {/* reuse same list or provide different */}
          <option>What is the middle name of your oldest sibling?</option>
          <option>In what city or town did your parents meet?</option>
          <option>What was the name of your first stuffed animal?</option>
          <option>What was the first concert you attended?</option>
          <option>What was the make and model of your first car?</option>
          <option>What was the name of the street you grew up on?</option>
          <option>What was the name of your elementary school?</option>
          <option>What year did you graduate high school?</option>
        </select>

        <input
          className="w-full p-2 mb-4 border"
          placeholder="Your Answer"
          value={securityAnswer2}
          onChange={(e) => setSecurityAnswer2(e.target.value)}
        />

        <label className="block mb-2 font-medium">Upload a photo of your ID:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setIdImage(e.target.files?.[0] || null)}
          className="w-full p-2 mb-4 border"
        />

        <label className="block mb-2 font-medium">Select account type:</label>
        <select
          className="w-full p-2 mb-4 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="dispatcher">Dispatcher</option>
          <option value="responder">Responder</option>
          <option value="reporter">Reporter</option>
          <option value="admin">Admin</option>
        </select>

        <button className="w-full bg-blue-500 text-white p-2 rounded mb-3">
          Sign up
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}





