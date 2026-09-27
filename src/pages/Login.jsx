import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Mountain, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router";
import Button from "../components/Button";
import Card from "../components/Card";
import FormField from "../components/FormField";
import { useTauFind } from "../context/TauFindContext";

const roles = [
  { id: "hiker", label: "Hiker", icon: Mountain },
  { id: "rescue", label: "Rescue Team", icon: ShieldCheck },
];

export default function Login() {
  const navigate = useNavigate();
  const { authenticate, selectRole, state } = useTauFind();
  const [email, setEmail] = useState(state.platform.authentication.email);
  const [password, setPassword] = useState("");
  const role = state.platform.currentRole ?? "hiker";

  const submit = (event) => {
    event.preventDefault();
    authenticate({ email, role });
    navigate(role === "rescue" ? "/rescue/dashboard" : "/hiker/dashboard");
  };

  return (
    <section className="tau-container grid min-h-[calc(100vh-4.5rem)] items-center gap-6 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:py-18">
      <motion.div animate={{ opacity: 1, x: 0 }} className="rounded-card bg-forest-900 p-8 text-white shadow-card md:p-10" initial={{ opacity: 0, x: -14 }}>
        <span className="grid size-12 place-items-center rounded-2xl bg-white/9 text-emerald-200"><LockKeyhole className="size-6" /></span>
        <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-emerald-200/58">Protected platform access</p>
        <h1 className="mt-3 max-w-md font-display text-4xl font-semibold tracking-tight md:text-5xl">Welcome back to the safety network.</h1>
        <p className="mt-5 max-w-md text-sm leading-7 text-emerald-100/58">Open the workspace built for your role. This hackathon foundation uses local mock authentication and does not transmit credentials.</p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="rounded-2xl border border-white/9 bg-white/[0.055] p-4"><p className="text-sm font-semibold">Hiker workspace</p><p className="mt-1 text-xs leading-5 text-emerald-100/45">Trips, bracelet status, and personal safety.</p></div>
          <div className="rounded-2xl border border-white/9 bg-white/[0.055] p-4"><p className="text-sm font-semibold">Rescue operations</p><p className="mt-1 text-xs leading-5 text-emerald-100/45">Incidents, maps, and response context.</p></div>
        </div>
      </motion.div>

      <Card className="mx-auto w-full max-w-xl" padding="p-6 sm:p-8 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-ai-500">Account access</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-forest-900">Log in to TauFind</h2>
        <p className="mt-2 text-sm text-forest-800/52">Select the workspace connected to your mock account.</p>

        <div aria-label="Account type" className="mt-6 grid grid-cols-2 gap-3" role="group">
          {roles.map(({ icon: Icon, id, label }) => (
            <button className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${role === id ? "border-ai-500 bg-ai-100 text-forest-900" : "border-forest-800/10 bg-white/55 text-forest-800/55 hover:border-forest-800/22"}`} key={id} onClick={() => selectRole(id)} type="button">
              <span className={`grid size-9 place-items-center rounded-xl ${role === id ? "bg-ai-500 text-white" : "bg-forest-100 text-forest-800"}`}><Icon className="size-4" /></span>
              <span className="text-sm font-semibold">{label}</span>
            </button>
          ))}
        </div>

        <form className="mt-7 space-y-5" onSubmit={submit}>
          <FormField autoComplete="email" id="login-email" label="Email" onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required type="email" value={email} />
          <FormField autoComplete="current-password" id="login-password" label="Password" onChange={(event) => setPassword(event.target.value)} placeholder="Enter any password for the MVP" required type="password" value={password} />
          <Button className="w-full" size="lg" type="submit">Login<ArrowRight className="size-4" /></Button>
        </form>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-forest-800/8 pt-5 text-sm sm:flex-row">
          <span className="text-forest-800/48">New to TauFind?</span>
          <Button as={Link} size="sm" to="/register" variant="ghost">Create account</Button>
        </div>
      </Card>
    </section>
  );
}
