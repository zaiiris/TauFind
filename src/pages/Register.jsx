import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Mountain, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router";
import Button from "../components/Button";
import Card from "../components/Card";
import FormField from "../components/FormField";
import { useTauFind } from "../context/TauFindContext";
import { useI18n } from "../i18n/I18nContext";

export default function Register() {
  const navigate = useNavigate();
  const { authenticate, selectRole, state, updateUser } = useTauFind();
  const { t } = useI18n();
  const [step, setStep] = useState(state.platform.currentRole ? 2 : 1);
  const [name, setName] = useState(state.user.name);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const role = state.platform.currentRole;
  const roleOptions = [
    { id: "hiker", title: t("auth.hiker"), description: t("auth.hikerRole"), icon: Mountain, tone: "bg-forest-800 text-white" },
    { id: "rescue", title: t("auth.rescue"), description: t("auth.rescueRole"), icon: ShieldCheck, tone: "bg-emergency-500 text-white" },
  ];

  const chooseRole = (nextRole) => {
    selectRole(nextRole);
    setStep(2);
  };

  const createAccount = (event) => {
    event.preventDefault();
    updateUser({ name });
    authenticate({ email, role });
    navigate(role === "rescue" ? "/rescue/dashboard" : "/hiker/dashboard");
  };

  return (
    <section className="tau-container min-h-[calc(100vh-4.5rem)] py-12 md:py-18">
      <header className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-forest-800/10 bg-white/65 px-3 py-1.5 text-xs font-semibold text-forest-800/58"><span className="grid size-5 place-items-center rounded-full bg-ai-500 text-[0.6rem] text-white">{step}</span>{t("auth.step", { step })}</div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-ai-500">{t("auth.createTitle")}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-forest-900 md:text-6xl">{step === 1 ? t("auth.chooseRole") : t("auth.createWorkspace", { role: role === "rescue" ? t("auth.rescue") : t("auth.hiker") })}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-forest-800/58">{step === 1 ? t("auth.roleIntro") : t("auth.detailsIntro")}</p>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div animate={{ opacity: 1, y: 0 }} className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2" exit={{ opacity: 0, y: -8 }} initial={{ opacity: 0, y: 10 }} key="roles">
            {roleOptions.map(({ description, icon: Icon, id, title, tone }) => (
              <button className="group text-left" key={id} onClick={() => chooseRole(id)} type="button">
                <Card className="h-full transition duration-200 group-hover:-translate-y-1 group-hover:border-ai-500/35" padding="p-7 md:p-8">
                  <div className="flex items-start justify-between gap-5"><span className={`grid size-14 place-items-center rounded-2xl shadow-lg ${tone}`}><Icon className="size-6" /></span><ArrowRight className="size-5 text-forest-800/28 transition group-hover:translate-x-1 group-hover:text-ai-500" /></div>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-forest-800/38">{t("auth.accountType")}</p>
                  <h2 className="mt-2 font-display text-3xl font-semibold text-forest-900">{title}</h2>
                  <p className="mt-3 text-sm leading-6 text-forest-800/55">{description}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ai-500">{t("auth.choose", { role: title })}<ArrowRight className="size-4" /></span>
                </Card>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div animate={{ opacity: 1, y: 0 }} className="mx-auto mt-10 max-w-xl" exit={{ opacity: 0, y: -8 }} initial={{ opacity: 0, y: 10 }} key="details">
            <Card padding="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-forest-900 p-4 text-white">
                <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-white/9">{role === "rescue" ? <ShieldCheck className="size-5" /> : <Mountain className="size-5" />}</span><div><p className="text-xs text-emerald-100/48">{t("auth.selectedRole")}</p><p className="font-semibold">{role === "rescue" ? t("auth.rescue") : t("auth.hiker")}</p></div></div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-300"><Check className="size-4" />{t("auth.saved")}</span>
              </div>
              <form className="mt-7 space-y-5" onSubmit={createAccount}>
                <FormField autoComplete="name" id="register-name" label={t("auth.name")} onChange={(event) => setName(event.target.value)} placeholder={role === "rescue" ? t("auth.rescueOperator") : t("auth.hikerName")} required value={name} />
                <FormField autoComplete="email" id="register-email" label={t("auth.email")} onChange={(event) => setEmail(event.target.value)} placeholder={t("auth.emailPlaceholder")} required type="email" value={email} />
                <FormField autoComplete="new-password" help={t("auth.localAuthHelp")} id="register-password" label={t("auth.password")} onChange={(event) => setPassword(event.target.value)} placeholder={t("auth.createPassword")} required type="password" value={password} />
                <Button className="w-full" size="lg" type="submit">{t("auth.createAccount")}<ArrowRight className="size-4" /></Button>
              </form>
              <div className="mt-5 flex items-center justify-between gap-3">
                <Button onClick={() => setStep(1)} size="sm" variant="ghost"><ArrowLeft className="size-4" />{t("auth.changeRole")}</Button>
                <Link className="text-sm font-semibold text-ai-500 hover:text-forest-800" to="/login">{t("auth.registered")}</Link>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
