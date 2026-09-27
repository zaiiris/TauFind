import { BrainCircuit } from "lucide-react";
import PagePlaceholder from "../components/PagePlaceholder";

export default function RiskAnalysis() {
  return <PagePlaceholder actionLabel="Enter hiking mode" actionTo="/hiking" description="The next phase will add a transparent risk calculation with factor-level explanations and recommendations." eyebrow="AI risk analysis" icon={BrainCircuit} title="Understand the risk, not just the score" />;
}
