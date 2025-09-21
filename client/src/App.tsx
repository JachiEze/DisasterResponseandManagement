import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import AdminMenu from "./pages/AdminMenu";
import ReporterMenu from "./pages/ReporterMenu";
import DispatcherMenu from "./pages/DispatcherMenu";
import ResponderMenu from "./pages/ResponderMenu";
import Dashboard from "./pages/Dashboard";
import PendingApprovals from "./pages/PendingApprovals";
import Resources from "./pages/Resources";
import Map from "./pages/Map";
import ReportDisaster from "./pages/ReportDisaster";
import AssessDisaster from "./pages/AssessDisaster";
import ResourcesAvailable from "./pages/ResourcesAvailable";
import HomePage from "./pages/HomePage";
import WebsiteFeedback from "./pages/WebsiteFeedback";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-menu" element={<AdminMenu />} />
        <Route path="/reporter-menu" element={<ReporterMenu />} />
        <Route path="/dispatcher-menu" element={<DispatcherMenu />} />
        <Route path="/responder-menu" element={<ResponderMenu />} />
        <Route path="/pending-approvals" element={<PendingApprovals />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/map" element={<Map />} />
        <Route path="/reportdisaster" element={<ReportDisaster />} />
        <Route path="/assessdisaster" element={<AssessDisaster />} />
        <Route path="/resourcesavailable" element={<ResourcesAvailable />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/websitefeedback" element={<WebsiteFeedback />} />
        <Route path="*" element={<Navigate to="/homepage" />} />
      </Routes>
    </BrowserRouter>
  );
}





