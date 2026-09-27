import { Activity } from "lucide-react";
import PagePlaceholder from "../components/PagePlaceholder";

export default function Hiking() {
  return <PagePlaceholder actionLabel="Preview emergency" actionTo="/emergency" description="Live route progress, bracelet telemetry, environmental conditions, and scenario controls will meet in this dashboard." eyebrow="Live hike" icon={Activity} title="Your trail, continuously understood" />;
}
