import { Navigate, Outlet, useLocation } from "react-router";
import { useTauFind } from "../context/TauFindContext";

export default function RoleRoute({ role }) {
  const location = useLocation();
  const { state } = useTauFind();
  const { authentication, currentRole } = state.platform;

  if (!authentication.isAuthenticated) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  if (currentRole !== role) {
    return <Navigate replace to={currentRole === "rescue" ? "/rescue/dashboard" : "/hiker/dashboard"} />;
  }

  return <Outlet />;
}
