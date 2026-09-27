import { Navigate, Route, Routes } from "react-router";
import { Activity, Bluetooth, Compass, HeartPulse, LayoutDashboard, Map, MapPinned, ShieldAlert, UserRound } from "lucide-react";
import AppShell from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import Demo from "./pages/Demo";
import Emergency from "./pages/Emergency";
import Hiking from "./pages/Hiking";
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

        <Route path="hiker/dashboard" element={<RolePlaceholder icon={LayoutDashboard} purpose="A personal safety overview for upcoming trips, active monitoring, and preparation status." role="Hiker" title="Hiker dashboard" />} />
        <Route path="hiker/profile" element={<RolePlaceholder icon={UserRound} purpose="Identity, experience, emergency contacts, and safety preferences for every mountain trip." role="Hiker" title="Safety profile" />} />
        <Route path="hiker/trips" element={<RolePlaceholder icon={MapPinned} purpose="Plan, review, and organize mountain routes with preparation context in one place." role="Hiker" title="My trips" />} />
        <Route path="hiker/risk-analysis" element={<RolePlaceholder icon={Activity} purpose="Review explainable preparation risk before entering a mountain route." role="Hiker" title="AI risk analysis" />} />
        <Route path="hiker/bracelet" element={<RolePlaceholder icon={Bluetooth} purpose="Pair the TauFind wearable and review GPS, battery, sensor, and LoRa readiness." role="Hiker" title="Bracelet connection" />} />
        <Route path="hiker/live" element={<RolePlaceholder icon={Compass} purpose="Follow route progress and live safety signals during an active hiking session." role="Hiker" title="Live hiking" />} />
        <Route path="hiker/emergency" element={<RolePlaceholder icon={HeartPulse} purpose="Understand emergency verification and offline rescue activation from the hiker view." role="Hiker" title="Emergency support" />} />

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
