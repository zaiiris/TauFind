import { Navigate, Route, Routes } from "react-router";
import { LayoutDashboard, Map, ShieldAlert } from "lucide-react";
import AppShell from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import Demo from "./pages/Demo";
import Emergency from "./pages/Emergency";
import Hiking from "./pages/Hiking";
import HikerBracelet from "./pages/HikerBracelet";
import HikerDashboard from "./pages/HikerDashboard";
import HikerProfile from "./pages/HikerProfile";
import HikerTrips from "./pages/HikerTrips";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Prepare from "./pages/Prepare";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import RiskAnalysis from "./pages/RiskAnalysis";
import RolePlaceholder from "./pages/RolePlaceholder";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="demo" element={<Demo />} />

        <Route path="hiker/dashboard" element={<HikerDashboard />} />
        <Route path="hiker/profile" element={<HikerProfile />} />
        <Route path="hiker/trips" element={<HikerTrips />} />
        <Route path="hiker/risk-analysis" element={<RiskAnalysis />} />
        <Route path="hiker/bracelet" element={<HikerBracelet />} />
        <Route path="hiker/live" element={<Hiking platformMode />} />
        <Route path="hiker/emergency" element={<Emergency />} />

        <Route path="rescue/dashboard" element={<RolePlaceholder icon={LayoutDashboard} purpose="Monitor operational status, active incidents, and response priorities from one rescue workspace." role="Rescue Team" title="Rescue dashboard" />} />
        <Route path="rescue/incidents" element={<RolePlaceholder icon={ShieldAlert} purpose="Review incoming emergency packets, tourist condition, confidence, and incident history." role="Rescue Team" title="Incident queue" />} />
        <Route path="rescue/map" element={<RolePlaceholder icon={Map} purpose="Visualize last known positions, relay coverage, search areas, and rescue stations." role="Rescue Team" title="Operations map" />} />

        {/* Existing MVP routes remain available during the platform transition. */}
        <Route path="profile" element={<Profile />} />
        <Route path="prepare" element={<Prepare />} />
        <Route path="risk-analysis" element={<RiskAnalysis />} />
        <Route path="hiking" element={<Hiking />} />
        <Route path="emergency" element={<Emergency />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="rescue" element={<Navigate replace to="/rescue/dashboard" />} />
        <Route path="hiker" element={<Navigate replace to="/hiker/dashboard" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
