import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    try {
      await axios.post("http://localhost:5000/api/feedback", {
        name,
        email,
        message,
      });
      setStatus("✅ Thank you! Your feedback has been sent.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("❌ Could not send feedback. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-950 text-gray-100 font-sans">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-black to-blue-900 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6 py-5">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white">
            Light in the Dark
          </h1>
          <nav className="space-x-6 text-gray-200">
            <a href="#about" className="hover:text-blue-400 transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">
              Contact
            </a>
            <Link to="/login" className="hover:text-blue-400 transition-colors">
              Login
            </Link>
            <Link to="/signup" className="hover:text-blue-400 transition-colors">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>


      <main className="flex-grow">
        <section className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-300">
            Rapid Response. Coordinated Relief.
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-10">
            Empowering communities to report, assess, and respond to disasters
            swiftly and effectively.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-block px-6 py-3 bg-black text-white border border-blue-700 rounded-lg shadow hover:bg-blue-800 hover:border-blue-600 transition"
            >
              Sign Up
            </Link>
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="bg-gradient-to-b from-gray-900 to-black py-16 border-t border-gray-800 text-center"
        >
          <div className="container mx-auto px-6 max-w-3xl">
            <h3 className="text-3xl font-bold text-blue-300 mb-6">
              About this Project
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Light in the Dark was created in response to the 2025 California
              Wildfires. After witnessing the loss of lives and property, we
              decided to use technology to help communities respond faster and
              stay safer during disasters.
            </p>
          </div>
        </section>

      
        <section
          id="contact"
          className="py-16 bg-gradient-to-b from-black to-gray-900 border-t border-gray-800"
        >
          <div className="container mx-auto px-6 max-w-xl">
            <h3 className="text-3xl font-bold text-center text-blue-300 mb-8">
              Contact Us
            </h3>
            <form
              onSubmit={handleSubmit}
              className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-4"
            >
              {status && (
                <p className="text-center text-sm font-medium mb-2 text-blue-300">
                  {status}
                </p>
              )}
              <input
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <textarea
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-700 text-white p-3 rounded hover:bg-blue-600 transition"
              >
                Send
              </button>
            </form>
          </div>
        </section>
      </main>

    
      <footer className="bg-black text-gray-400 py-6 border-t border-gray-800">
        <div className="container mx-auto text-center text-sm">
          © {new Date().getFullYear()} Light in the Dark · All rights reserved.
        </div>
      </footer>
    </div>
  );
}


