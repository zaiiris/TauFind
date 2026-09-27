import { motion } from "framer-motion";
import { Mountain } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";

export default function LoadingScreen() {
  const { t } = useI18n();
  return (
    <motion.div animate={{ opacity: 1 }} className="fixed inset-0 z-[100] grid place-items-center bg-forest-950 text-white" exit={{ opacity: 0 }} initial={{ opacity: 0 }}>
      <div className="text-center"><motion.span animate={{ scale: [0.96, 1.04, 0.96] }} className="mx-auto grid size-16 place-items-center rounded-2xl bg-ai-500 shadow-2xl shadow-ai-500/25" transition={{ duration: 1.6, repeat: Infinity }}><Mountain className="size-8" /></motion.span><p className="mt-5 font-display text-2xl font-semibold">TauFind</p><p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-100/45">{t("common.loading")}</p><div className="mx-auto mt-5 h-1 w-36 overflow-hidden rounded-full bg-white/10"><motion.div animate={{ x: ["-100%", "100%"] }} className="h-full w-1/2 rounded-full bg-ai-500" transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }} /></div></div>
    </motion.div>
  );
}
