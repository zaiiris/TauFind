import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Check,
  ContactRound,
  HeartPulse,
  PhoneCall,
  ShieldCheck,
  Siren,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Card from "../components/Card";
import FormField from "../components/FormField";
import JourneyProgress from "../components/JourneyProgress";
import Toggle from "../components/Toggle";
import { useTauFind } from "../context/TauFindContext";

const experienceOptions = [
  { value: "beginner", label: "Beginner", detail: "Fewer than 5 mountain hikes" },
  { value: "intermediate", label: "Intermediate", detail: "Regular marked-trail experience" },
  { value: "advanced", label: "Advanced", detail: "Technical and remote terrain" },
];

const countryOptions = [
  { value: "Kazakhstan", label: "Kazakhstan" },
  { value: "Kyrgyzstan", label: "Kyrgyzstan" },
  { value: "Uzbekistan", label: "Uzbekistan" },
  { value: "Other", label: "Other" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { state, updateSafety, updateUser } = useTauFind();
  const { user, safety } = state;

  const requiredValues = [
    user.name,
    user.age,
    user.country,
    user.experience,
    user.emergencyContact.name,
    user.emergencyContact.phone,
  ];
  const completed = requiredValues.filter((value) => String(value).trim()).length;
  const completeness = Math.round((completed / requiredValues.length) * 100);
  const profileReady = completeness === 100;

  const updateEmergencyContact = (field, value) => {
    updateUser({
      emergencyContact: {
        ...user.emergencyContact,
        [field]: value,
      },
    });
  };

  const updateSetting = (field, value) => {
    updateSafety({
      settings: {
        ...safety.settings,
        [field]: value,
      },
    });
  };

  const submitProfile = (event) => {
    event.preventDefault();
    if (profileReady) navigate("/prepare");
  };

  return (
    <div className="tau-container py-10 md:py-14">
      <div className="mx-auto max-w-2xl">
        <JourneyProgress current={0} />
      </div>

      <div className="mt-12 grid items-start gap-7 lg:grid-cols-[1fr_22rem]">
        <form className="space-y-6" onSubmit={submitProfile}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ai-500">Safety profile</p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-[-0.035em] text-forest-900 md:text-5xl">
              The details rescue teams cannot ask for later.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-forest-800/58">
              TauFind uses experience to assess prevention risk and keeps essential identity and contact information ready for an emergency relay.
            </p>
          </div>

          <Card>
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ai-100 text-ai-500">
                <UserRound aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-forest-900">About the hiker</h2>
                <p className="mt-1 text-sm text-forest-800/50">Used to match route difficulty and response needs.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FormField
                autoComplete="name"
                id="name"
                label="Full name"
                onChange={(event) => updateUser({ name: event.target.value })}
                placeholder="Amina Sarsen"
                required
                value={user.name}
              />
              <FormField
                id="age"
                label="Age"
                max="90"
                min="12"
                onChange={(event) => updateUser({ age: event.target.value })}
                placeholder="17"
                required
                type="number"
                value={user.age}
              />
              <FormField
                id="country"
                label="Country"
                onChange={(event) => updateUser({ country: event.target.value })}
                options={countryOptions}
                required
                value={user.country}
              />
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-semibold text-forest-900">Hiking experience</legend>
              <p className="mt-1 text-xs text-forest-800/48">This changes route compatibility and the prevention score.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {experienceOptions.map((option) => {
                  const selected = user.experience === option.value;
                  return (
                    <button
                      aria-pressed={selected}
                      className={`relative rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-forest-700 bg-forest-100/70 ring-2 ring-forest-700/8"
                          : "border-forest-800/10 bg-white/60 hover:border-forest-800/22"
                      }`}
                      key={option.value}
                      onClick={() => updateUser({ experience: option.value })}
                      type="button"
                    >
                      {selected && <Check aria-hidden="true" className="absolute right-3 top-3 size-4 text-safe-500" />}
                      <span className="block text-sm font-semibold text-forest-900">{option.label}</span>
                      <span className="mt-2 block text-xs leading-5 text-forest-800/48">{option.detail}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emergency-100 text-emergency-500">
                <PhoneCall aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-forest-900">Emergency contact</h2>
                <p className="mt-1 text-sm text-forest-800/50">Included only when the incident is escalated.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FormField
                autoComplete="name"
                id="emergency-name"
                label="Contact name"
                onChange={(event) => updateEmergencyContact("name", event.target.value)}
                placeholder="Dana Sarsen"
                required
                value={user.emergencyContact.name}
              />
              <FormField
                autoComplete="tel"
                help="Include the country code so rescue teams can call directly."
                id="emergency-phone"
                label="Phone number"
                onChange={(event) => updateEmergencyContact("phone", event.target.value)}
                placeholder="+7 701 555 0142"
                required
                type="tel"
                value={user.emergencyContact.phone}
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-800">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-forest-900">Automatic safety</h2>
                <p className="mt-1 text-sm text-forest-800/50">Choose what the bracelet watches during an active hike.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <Toggle checked={safety.settings.fallDetection} description="Detects sudden impact followed by inactivity." icon={Activity} label="Fall detection" onChange={(value) => updateSetting("fallDetection", value)} />
              <Toggle checked={safety.settings.heartMonitoring} description="Flags sustained readings outside the expected hiking range." icon={HeartPulse} label="Heart monitoring" onChange={(value) => updateSetting("heartMonitoring", value)} />
              <Toggle checked={safety.settings.emergencyAlerts} description="Starts a confirmation countdown before contacting rescue." icon={Siren} label="Emergency alerts" onChange={(value) => updateSetting("emergencyAlerts", value)} />
            </div>
          </Card>

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-xs leading-5 text-forest-800/48">Saved automatically on this device for the MVP demonstration.</p>
            <Button disabled={!profileReady} size="lg" type="submit">
              Continue to route planning
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </form>

        <div className="space-y-5 lg:sticky lg:top-24">
          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-ai-500">Profile readiness</p>
                <p className="mt-2 font-display text-2xl font-semibold text-forest-900">{completeness}% complete</p>
              </div>
              <div className="relative grid size-16 place-items-center rounded-full" style={{ background: `conic-gradient(#2e8b57 ${completeness}%, rgba(15,61,46,.1) 0)` }}>
                <div className="grid size-12 place-items-center rounded-full bg-white text-sm font-bold text-forest-900">{completed}/6</div>
              </div>
            </div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-forest-800/8">
              <motion.div animate={{ width: `${completeness}%` }} className="h-full rounded-full bg-safe-500" initial={false} />
            </div>
            <p className="mt-3 text-xs leading-5 text-forest-800/48">
              {profileReady ? "Ready for route matching." : `${requiredValues.length - completed} required detail${requiredValues.length - completed === 1 ? "" : "s"} remaining.`}
            </p>
          </Card>

          <Card className="overflow-hidden" padding="p-0">
            <div className="bg-forest-900 p-5 text-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-200/60">Rescue card preview</p>
                  <p className="mt-2 font-display text-xl font-semibold">{user.name || "Hiker name"}</p>
                </div>
                <ContactRound aria-hidden="true" className="size-6 text-emerald-200/70" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                <div>
                  <p className="text-[0.62rem] uppercase tracking-wider text-emerald-100/40">Age</p>
                  <p className="mt-1 text-sm font-semibold">{user.age || "—"}</p>
                </div>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-wider text-emerald-100/40">Experience</p>
                  <p className="mt-1 text-sm font-semibold capitalize">{user.experience}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[0.62rem] uppercase tracking-wider text-emerald-100/40">Emergency contact</p>
                  <p className="mt-1 truncate text-sm font-semibold">{user.emergencyContact.name || "Not provided"}</p>
                  <p className="mt-0.5 text-xs text-emerald-100/55">{user.emergencyContact.phone || "Phone pending"}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/72 px-5 py-3 text-xs font-medium text-safe-500">
              <ShieldCheck aria-hidden="true" className="size-4" />
              Shared only after emergency escalation
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
