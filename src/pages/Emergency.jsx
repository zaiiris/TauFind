import { Siren } from "lucide-react";
import PagePlaceholder from "../components/PagePlaceholder";

export default function Emergency() {
  return <PagePlaceholder actionLabel="Open rescue dashboard" actionTo="/dashboard" description="Fall detection, a clear confirmation countdown, and offline emergency relay will be built as one credible escalation flow." eyebrow="Safety escalation" icon={Siren} title="Signal the right help, faster" />;
}
