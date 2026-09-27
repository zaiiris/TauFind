import { useState } from "react";
import { Check, ContactRound, Droplets, Flashlight, Map, ShieldPlus, Shirt, UserRound } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import FormField from "../components/FormField";
import { useTauFind } from "../context/TauFindContext";

const experienceOptions = [
  ["beginner", "Beginner", "New to mountain routes"],
  ["intermediate", "Intermediate", "Regular marked-trail experience"],
  ["advanced", "Advanced", "Confident on remote terrain"],
];

const equipmentOptions = [
  ["water", "Water", Droplets],
  ["first-aid", "First aid", ShieldPlus],
  ["navigation", "Navigation", Map],
  ["warm-layers", "Warm clothes", Shirt],
  ["headlamp", "Flashlight", Flashlight],
];

export default function HikerProfile() {
  const { state, updateTrip, updateUser } = useTauFind();
  const [saved, setSaved] = useState(false);
  const { trip, user } = state;
  const profileItems = [user.name, user.age, user.experience, user.emergencyContact.name, user.emergencyContact.phone];
  const completeness = Math.round(((profileItems.filter(Boolean).length + trip.equipment.filter((item) => equipmentOptions.some(([id]) => id === item)).length) / 10) * 100);

  const changeUser = (updates) => {
    setSaved(false);
    updateUser(updates);
  };

  const toggleEquipment = (itemId) => {
    setSaved(false);
    updateTrip({ equipment: trip.equipment.includes(itemId) ? trip.equipment.filter((item) => item !== itemId) : [...trip.equipment, itemId] });
  };

  return (
    <div className="tau-container py-10 md:py-14">
      <header className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-ai-500">Hiker safety profile</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-forest-900 md:text-6xl">Information that travels with you.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-forest-800/55">Experience and equipment influence the deterministic risk model. Emergency contact details stay ready for escalation.</p></div>
        <div className="rounded-2xl border border-forest-800/8 bg-white/65 px-5 py-4"><p className="text-[0.62rem] font-bold uppercase tracking-[0.15em] text-forest-800/38">Profile completeness</p><p className="mt-1 font-display text-3xl font-semibold text-forest-900">{completeness}%</p></div>
      </header>

      <form className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}>
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-ai-100 text-ai-500"><UserRound className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-ai-500">Personal information</p><h2 className="mt-1 font-display text-2xl font-semibold text-forest-900">About the hiker</h2></div></div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2"><FormField autoComplete="name" id="hiker-name" label="Name" onChange={(event) => changeUser({ name: event.target.value })} placeholder="Your full name" required value={user.name} /><FormField id="hiker-age" label="Age" min="12" onChange={(event) => changeUser({ age: event.target.value })} required type="number" value={user.age} /></div>
            <fieldset className="mt-6"><legend className="text-sm font-semibold text-forest-900">Experience level</legend><div className="mt-3 grid gap-3 sm:grid-cols-3">{experienceOptions.map(([value, label, detail]) => { const selected = user.experience === value; return <button aria-pressed={selected} className={`rounded-2xl border p-4 text-left transition ${selected ? "border-ai-500 bg-ai-100" : "border-forest-800/9 bg-white/55 hover:border-forest-800/20"}`} key={value} onClick={() => changeUser({ experience: value })} type="button"><span className="flex items-center justify-between gap-2 text-sm font-semibold text-forest-900">{label}{selected && <Check className="size-4 text-ai-500" />}</span><span className="mt-1 block text-xs leading-5 text-forest-800/45">{detail}</span></button>; })}</div></fieldset>
          </Card>

          <Card>
            <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-emergency-100 text-emergency-500"><ContactRound className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emergency-500">Emergency contact</p><h2 className="mt-1 font-display text-2xl font-semibold text-forest-900">Who rescue can call</h2></div></div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2"><FormField autoComplete="name" id="contact-name" label="Contact person" onChange={(event) => changeUser({ emergencyContact: { name: event.target.value } })} placeholder="Contact name" required value={user.emergencyContact.name} /><FormField autoComplete="tel" id="contact-phone" label="Phone number" onChange={(event) => changeUser({ emergencyContact: { phone: event.target.value } })} placeholder="+7 700 000 0000" required type="tel" value={user.emergencyContact.phone} /></div>
          </Card>
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ai-500">Equipment checklist</p><h2 className="mt-2 font-display text-2xl font-semibold text-forest-900">Personal trail kit</h2><p className="mt-2 text-sm leading-6 text-forest-800/50">These items directly change equipment readiness in AI risk analysis.</p>
          <div className="mt-6 space-y-3">{equipmentOptions.map(([id, label, Icon]) => { const checked = trip.equipment.includes(id); return <button aria-pressed={checked} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${checked ? "border-safe-500/25 bg-emerald-50/70" : "border-forest-800/9 bg-white/55"}`} key={id} onClick={() => toggleEquipment(id)} type="button"><span className={`grid size-10 place-items-center rounded-xl ${checked ? "bg-safe-500 text-white" : "bg-forest-100 text-forest-800"}`}><Icon className="size-4" /></span><span className="flex-1 text-sm font-semibold text-forest-900">{label}</span><span className={`grid size-6 place-items-center rounded-full border ${checked ? "border-safe-500 bg-safe-500 text-white" : "border-forest-800/15"}`}>{checked && <Check className="size-3.5" />}</span></button>; })}</div>
          <Button className="mt-7 w-full" size="lg" type="submit">{saved ? <><Check className="size-4" />Profile saved</> : "Save safety profile"}</Button>
          <p className="mt-3 text-center text-xs text-forest-800/38">Changes are persisted locally on this device.</p>
        </Card>
      </form>
    </div>
  );
}
