export const emergencyScenarios = {
  minorWarning: {
    id: "minorWarning",
    name: "Minor warning",
    shortLabel: "Warning",
    description: "Irregular pace and exertion require monitoring, but do not confirm an emergency.",
    input: {
      fallDetected: false,
      movementStatus: "Movement slowing",
      heartRate: 152,
      temperature: 3,
      altitude: 2480,
      battery: 71,
      riskScore: 54,
    },
    braceletStatus: "Monitoring",
    mobileNetwork: "Limited",
    lora: { offlineMode: false, status: "Standby" },
    rescue: { status: "Not dispatched", eta: null },
  },
  fallDetected: {
    id: "fallDetected",
    name: "Fall detected",
    shortLabel: "Fall",
    description: "Impact, no movement, and abnormal heart rate require user confirmation.",
    input: {
      fallDetected: true,
      movementStatus: "No movement detected",
      heartRate: 42,
      temperature: 1,
      altitude: 2780,
      battery: 64,
      riskScore: 94,
    },
    braceletStatus: "Fall protocol active",
    mobileNetwork: "Unavailable",
    lora: { offlineMode: true, status: "Ready to transmit" },
    rescue: { status: "Awaiting confirmation", eta: "18 min" },
  },
  criticalOffline: {
    id: "criticalOffline",
    name: "Critical · no mobile network",
    shortLabel: "Offline critical",
    description: "A severe fall in freezing conditions must be relayed entirely through LoRa.",
    input: {
      fallDetected: true,
      movementStatus: "No movement · unresponsive",
      heartRate: 35,
      temperature: -9,
      altitude: 3200,
      battery: 18,
      riskScore: 98,
    },
    braceletStatus: "Critical protocol active",
    mobileNetwork: "Unavailable",
    lora: { offlineMode: true, status: "Priority relay ready" },
    rescue: { status: "Priority response", eta: "14 min" },
  },
};

export function getEmergencyScenario(id) {
  return emergencyScenarios[id] ?? emergencyScenarios.fallDetected;
}
