import { AnimatePresence, motion } from "framer-motion";
import { Menu, Mountain, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import Button from "./Button";

const links = [
  { label: "Safety setup", to: "/profile" },
  { label: "Plan a route", to: "/prepare" },
];

function Brand() {
  return (
    <Link aria-label="TauFind home" className="flex items-center gap-2.5" to="/">
      <span className="grid size-9 place-items-center rounded-xl bg-forest-800 text-white shadow-lg shadow-forest-900/15">
        <Mountain aria-hidden="true" className="size-5" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-forest-900">TauFind</span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-forest-800/8 bg-sand-50/78 backdrop-blur-xl">
      <nav aria-label="Primary navigation" className="tau-container flex h-18 items-center justify-between gap-6">
        <Brand />

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive ? "bg-forest-800/8 text-forest-900" : "text-forest-800/60 hover:text-forest-900"
                }`
              }
              key={link.to}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <div className="mr-2 flex items-center gap-2 text-xs font-semibold text-safe-500">
            <span className="size-1.5 rounded-full bg-safe-500 shadow-[0_0_0_4px_rgba(46,139,87,0.12)]" />
            System ready
          </div>
          <Button as={Link} size="sm" to="/profile">
            <ShieldCheck aria-hidden="true" className="size-4" />
            Start setup
          </Button>
        </div>

        <button
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="grid size-10 place-items-center rounded-full text-forest-900 hover:bg-forest-800/8 md:hidden"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden border-t border-forest-800/8 bg-sand-50 md:hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
          >
            <div className="tau-container flex flex-col gap-1 py-4">
              {links.map((link) => (
                <NavLink
                  className="rounded-xl px-3 py-3 text-sm font-medium text-forest-900 hover:bg-forest-800/7"
                  key={link.to}
                  onClick={() => setOpen(false)}
                  to={link.to}
                >
                  {link.label}
                </NavLink>
              ))}
              <Button as={Link} className="mt-3" onClick={() => setOpen(false)} to="/profile">
                Start safety setup
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
