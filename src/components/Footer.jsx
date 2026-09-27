import { Mountain } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useI18n } from "../i18n/I18nContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Footer() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  const dark = pathname.startsWith("/rescue");
  const groups = [
    { title: t("footer.platform"), links: [[t("footer.hiker"), "/register"], [t("footer.rescue"), "/register"], [t("footer.demo"), "/demo"]] },
    { title: t("footer.resources"), links: [[t("footer.how"), "/#how-it-works"], [t("footer.technology"), "/#technology"], [t("footer.faq"), "/#faq"]] },
  ];
  return (
    <footer className={`relative z-20 border-t ${dark ? "border-white/8 bg-ops-950 text-white" : "border-forest-800/10 bg-forest-950 text-white"}`}>
      <div className="tau-container grid gap-10 py-10 md:grid-cols-[1.4fr_1fr_1fr] md:py-14">
        <div><Link className="inline-flex items-center gap-2.5" to="/"><span className="grid size-9 place-items-center rounded-xl bg-ai-500"><Mountain className="size-5" /></span><span className="font-display text-xl font-semibold">TauFind</span></Link><p className="mt-4 max-w-sm text-sm leading-6 text-white/48">{t("footer.description")}</p></div>
        {groups.map((group) => <div key={group.title}><p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">{group.title}</p><div className="mt-4 flex flex-col gap-3">{group.links.map(([label, to]) => <Link className="w-fit text-sm text-white/62 transition hover:text-white" key={`${label}-${to}`} to={to}>{label}</Link>)}</div></div>)}
        <div className="md:col-start-3"><p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">{t("footer.language")}</p><div className="mt-4"><LanguageSwitcher dark /></div></div>
      </div>
      <div className="border-t border-white/8"><div className="tau-container py-5 text-xs text-white/35">© {new Date().getFullYear()} {t("footer.rights")}</div></div>
    </footer>
  );
}
