import { Languages } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";

export default function LanguageSwitcher({ dark = false, compact = false }) {
  const { language, setLanguage, t } = useI18n();
  return (
    <div aria-label={t("common.language")} className={`inline-flex items-center rounded-full border p-1 ${dark ? "border-white/10 bg-white/5" : "border-forest-800/10 bg-white/55"}`}>
      {!compact && <Languages aria-hidden="true" className={`ml-1.5 mr-1 size-3.5 ${dark ? "text-ops-100/50" : "text-forest-800/45"}`} />}
      {["en", "ru"].map((locale) => <button aria-label={locale === "en" ? t("common.englishName") : t("common.russianName")} className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold transition ${language === locale ? (dark ? "bg-ai-500 text-white" : "bg-forest-800 text-white") : (dark ? "text-ops-100/50 hover:text-white" : "text-forest-800/45 hover:text-forest-900")}`} key={locale} onClick={() => setLanguage(locale)} type="button">{locale.toUpperCase()}</button>)}
    </div>
  );
}
