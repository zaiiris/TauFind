import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, Mountain, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useTauFind } from "../context/TauFindContext";
import Button from "./Button";

const publicLinks = [
  { label: "Home", to: "/" },
  { label: "How it works", to: "/#how-it-works" },
  { label: "Demo", to: "/demo" },
  { label: "Login", to: "/login" },
];

const hikerLinks = [
  { label: "Dashboard", to: "/hiker/dashboard" },
  { label: "Profile", to: "/hiker/profile" },
  { label: "My Trips", to: "/hiker/trips" },
  { label: "Risk Analysis", to: "/hiker/risk-analysis" },
  { label: "Bracelet", to: "/hiker/bracelet" },
  { label: "Live Hiking", to: "/hiker/live" },
  { label: "Emergency", to: "/hiker/emergency" },
];

const rescueLinks = [
  { label: "Dashboard", to: "/rescue/dashboard" },
  { label: "Incidents", to: "/rescue/incidents" },
  { label: "Map", to: "/rescue/map" },
];

function Brand() {
  return (
    <Link aria-label="TauFind home" className="flex items-center gap-2.5" to="/">
      <span className="grid size-9 place-items-center rounded-xl bg-forest-800 text-white shadow-lg shadow-forest-900/15"><Mountain aria-hidden="true" className="size-5" /></span>
      <span className="font-display text-lg font-semibold tracking-tight text-forest-900">TauFind</span>
    </Link>
  );
}

function NavigationLink({ label, mobile = false, onClick, to }) {
  return (
    <NavLink
      className={({ isActive }) => `${mobile ? "rounded-xl px-3 py-3" : "rounded-full px-4 py-2"} text-sm font-medium transition ${isActive && !to.includes("#") ? "bg-forest-800/8 text-forest-900" : "text-forest-800/60 hover:bg-forest-800/5 hover:text-forest-900"}`}
      onClick={onClick}
      to={to}
    >
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, state } = useTauFind();
  const { authentication, currentRole } = state.platform;
  const authenticated = authentication.isAuthenticated;
  const links = authenticated ? (currentRole === "rescue" ? rescueLinks : hikerLinks) : publicLinks;
  const roleLabel = currentRole === "rescue" ? "Rescue Team" : "Hiker";

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-forest-800/8 bg-sand-50/82 backdrop-blur-xl">
      <nav aria-label="Primary navigation" className="tau-container flex h-18 items-center justify-between gap-6">
        <Brand />

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => <NavigationLink key={link.to} {...link} />)}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {authenticated ? (
            <>
              <div className="mr-1 text-right"><p className="text-[0.58rem] font-bold uppercase tracking-[0.15em] text-forest-800/36">Workspace</p><p className="text-xs font-semibold text-forest-900">{roleLabel}</p></div>
              <Button aria-label="Log out" onClick={handleLogout} size="sm" variant="secondary"><LogOut className="size-4" />Logout</Button>
            </>
          ) : (
            <Button as={Link} size="sm" to="/register"><ShieldCheck aria-hidden="true" className="size-4" />Get started</Button>
          )}
        </div>

        <button aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"} className="grid size-10 place-items-center rounded-full text-forest-900 hover:bg-forest-800/8 lg:hidden" onClick={() => setOpen((current) => !current)} type="button">
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div animate={{ height: "auto", opacity: 1 }} className="overflow-hidden border-t border-forest-800/8 bg-sand-50 lg:hidden" exit={{ height: 0, opacity: 0 }} initial={{ height: 0, opacity: 0 }}>
            <div className="tau-container flex flex-col gap-1 py-4">
              {authenticated && <div className="mb-2 rounded-xl bg-forest-100 px-3 py-2"><p className="text-[0.58rem] font-bold uppercase tracking-wider text-forest-800/38">Active workspace</p><p className="text-sm font-semibold text-forest-900">{roleLabel}</p></div>}
              {links.map((link) => <NavigationLink key={link.to} mobile onClick={() => setOpen(false)} {...link} />)}
              {authenticated ? (
                <Button className="mt-3" onClick={handleLogout} variant="secondary"><LogOut className="size-4" />Logout</Button>
              ) : (
                <Button as={Link} className="mt-3" onClick={() => setOpen(false)} to="/register">Get started</Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
