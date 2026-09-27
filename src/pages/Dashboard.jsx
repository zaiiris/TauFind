import { ShieldCheck } from "lucide-react";
import PagePlaceholder from "../components/PagePlaceholder";

export default function Dashboard() {
  return <PagePlaceholder description="A prioritized incident queue, operational map, hiker context, and recommended response will form the rescue workspace." eyebrow="Rescue operations" icon={ShieldCheck} title="Context before deployment" />;
}
