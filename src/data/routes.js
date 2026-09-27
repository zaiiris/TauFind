export const routes = [
  {
    id: "sairam-ugam",
    name: "Sairam-Ugam",
    region: "Turkistan Region",
    altitude: 2800,
    distance: 14.2,
    difficulty: "Challenging",
    weather: "6°C · Windy",
    mobileCoverage: 18,
    duration: "6–7 hours",
    description: "Remote alpine valleys, steep elevation gain, and limited connectivity.",
    requiredEquipment: ["water", "first-aid", "warm-layers", "navigation", "headlamp"],
    path: "M18 204 C70 185 92 158 128 150 S192 132 216 96 S278 72 318 38",
  },
  {
    id: "medeu-shymbulak",
    name: "Medeu–Shymbulak",
    region: "Almaty",
    altitude: 2260,
    distance: 8.5,
    difficulty: "Moderate",
    weather: "11°C · Clear",
    mobileCoverage: 72,
    duration: "3–4 hours",
    description: "A well-known ascent with reliable access and fast-changing mountain weather.",
    requiredEquipment: ["water", "warm-layers", "navigation"],
    path: "M18 204 C58 196 88 166 124 172 S192 136 222 118 S270 64 318 52",
  },
  {
    id: "kolsai",
    name: "Kolsai Lakes",
    region: "Almaty Region",
    altitude: 2250,
    distance: 15.7,
    difficulty: "Moderate",
    weather: "9°C · Showers",
    mobileCoverage: 34,
    duration: "5–6 hours",
    description: "Forested lake trail with long distances, wet ground, and patchy signal.",
    requiredEquipment: ["water", "first-aid", "warm-layers", "navigation", "power-bank"],
    path: "M18 204 C54 170 92 188 122 146 S170 116 208 128 S266 92 318 44",
  },
];

export const equipmentOptions = [
  { id: "water", label: "Water", detail: "At least 1.5 L" },
  { id: "first-aid", label: "First aid kit", detail: "Compact trail kit" },
  { id: "warm-layers", label: "Warm layers", detail: "Wind and rain protection" },
  { id: "navigation", label: "Navigation", detail: "Offline map or compass" },
  { id: "headlamp", label: "Headlamp", detail: "With spare batteries" },
  { id: "power-bank", label: "Power bank", detail: "Charged before departure" },
];

export function getRouteById(routeId) {
  return routes.find((route) => route.id === routeId) ?? null;
}
