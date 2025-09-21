import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../utils/logoutHelper";

type Props = {
  role: string;
  showPending?: boolean;
};

export default function MenuBar({ role, showPending }: Props) {
  const navigate = useNavigate();

  const linkClasses =
    "w-56 text-center px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 " +
    "text-white font-medium rounded-xl shadow-md transition-all duration-200 " +
    "hover:scale-105 hover:from-indigo-500 hover:to-blue-600";

  return (
    <div className="flex flex-col space-y-4 bg-white/80 backdrop-blur-sm px-10 py-8 rounded-2xl shadow-lg items-center">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Main Menu</h1>

      <Link to="/chat" className={linkClasses}>Group Chat</Link>
      <Link to="/dashboard" className={linkClasses}>Dashboard</Link>

      {showPending && role === "admin" && (
        <Link to="/pending-approvals" className={linkClasses}>Account Management</Link>
      )}

      {role === "admin" && (
        <Link to="/resources" className={linkClasses}>Resource Management</Link>
      )}

      {(role === "dispatcher" || role === "responder") && (
        <Link to="/resourcesavailable" className={linkClasses}>Available Resources</Link>
      )}

      {role === "responder" && (
        <Link to="/map" className={linkClasses}>Map</Link>
      )}

      {role === "reporter" && (
        <Link to="/reportdisaster" className={linkClasses}>Report Disaster</Link>
      )}

      {role === "dispatcher" && (
        <Link to="/assessdisaster" className={linkClasses}>Assess Disaster</Link>
      )}

      {role === "admin" && (
        <Link to="/websitefeedback" className={linkClasses}>Website Feedback</Link>
      )}

      <button
        onClick={() => handleLogout(navigate)}
        className={`${linkClasses} bg-red-500 hover:from-red-600 hover:to-red-700`}
      >
        Logout
      </button>
    </div>
  );
}







