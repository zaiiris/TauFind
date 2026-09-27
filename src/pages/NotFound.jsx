import { Compass } from "lucide-react";
import PagePlaceholder from "../components/PagePlaceholder";

export default function NotFound() {
  return <PagePlaceholder description="This route is outside the current TauFind trail map. Return to safety and choose a known destination." eyebrow="404 · Route not found" icon={Compass} title="You have wandered off route" />;
}
