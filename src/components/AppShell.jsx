import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router";
import DemoController from "./DemoController";
import Navbar from "./Navbar";

function MountainBackdrop() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-72 w-full text-forest-900/[0.045]"
      preserveAspectRatio="none"
      viewBox="0 0 1440 320"
    >
      <path d="M0 320 0 268 176 125 328 239 534 57 684 213 882 94 1052 229 1246 116 1440 254 1440 320Z" fill="currentColor" />
      <path d="m0 320 278-141 174 86 282-170 218 141 202-74 286 141v17Z" fill="currentColor" opacity="0.48" />
    </svg>
  );
}

export default function AppShell() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-sand-100 text-forest-900">
      <div aria-hidden="true" className="tau-grid-overlay pointer-events-none fixed inset-0 opacity-70" />
      <div aria-hidden="true" className="pointer-events-none fixed -left-24 top-24 size-80 rounded-full bg-ai-500/7 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none fixed -right-24 top-1/2 size-96 rounded-full bg-forest-700/7 blur-3xl" />
      <Navbar />
      <main className="relative z-10">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 8 }}
          key={location.pathname}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>
      <DemoController />
      <MountainBackdrop />
    </div>
  );
}
