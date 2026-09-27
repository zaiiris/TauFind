import { Navigate, Route, Routes } from "react-router";
import AppShell from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import Emergency from "./pages/Emergency";
import Hiking from "./pages/Hiking";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Prepare from "./pages/Prepare";
import Profile from "./pages/Profile";
import RiskAnalysis from "./pages/RiskAnalysis";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Landing />} />
        <Route path="register" element={<Navigate replace to="/profile" />} />
        <Route path="profile" element={<Profile />} />
        <Route path="prepare" element={<Prepare />} />
        <Route path="risk-analysis" element={<RiskAnalysis />} />
        <Route path="hiking" element={<Hiking />} />
        <Route path="emergency" element={<Emergency />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
