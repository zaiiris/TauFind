export const sensorScenarios = {
  normal: {
    id: "normal",
    mode: "Normal",
    label: "Normal hiking",
    summary: "All readings are inside the expected hiking range.",
    status: "safe",
    riskScore: 18,
    route: { progress: 36, elapsedSeconds: 5220 },
    sensors: {
      connection: "Connected",
      batteryLevel: 82,
      gps: "Locked · ±4 m",
      heartRate: 94,
      temperature: 8,
      lora: "Connected",
      movement: "Steady hiking",
      signal: "-74 dBm",
    },
  },
  cold: {
    id: "cold",
    mode: "Warning",
    label: "Cold environment",
    summary: "Temperature exposure is increasing faster than planned.",
    status: "warning",
    riskScore: 48,
    route: { progress: 52, elapsedSeconds: 7620 },
    sensors: {
      connection: "Connected",
      batteryLevel: 73,
      gps: "Locked · ±6 m",
      heartRate: 108,
      temperature: -8,
      lora: "Connected",
      movement: "Moving slowly",
      signal: "-81 dBm",
    },
  },
  highHeartRate: {
    id: "highHeartRate",
    mode: "Warning",
    label: "High heart rate",
    summary: "Sustained exertion is above the safe range for this hiker.",
    status: "warning",
    riskScore: 67,
    route: { progress: 68, elapsedSeconds: 9180 },
    sensors: {
      connection: "Connected",
      batteryLevel: 68,
      gps: "Locked · ±5 m",
      heartRate: 168,
      temperature: 4,
      lora: "Connected",
      movement: "Irregular pace",
      signal: "-86 dBm",
    },
  },
  fall: {
    id: "fall",
    mode: "Emergency",
    label: "Fall detected",
    summary: "Impact and absent movement triggered an automatic rescue alert.",
    status: "emergency",
    riskScore: 94,
    route: { progress: 72, elapsedSeconds: 9420 },
    sensors: {
      connection: "Emergency link",
      batteryLevel: 64,
      gps: "Locked · ±3 m",
      heartRate: 42,
      temperature: 3,
      lora: "SOS transmitting",
      movement: "Fall · no movement",
      signal: "-89 dBm",
    },
  },
};

export const demoModes = {
  normal: "normal",
  warning: "highHeartRate",
  emergency: "fall",
};

export function getSensorScenario(id) {
  return sensorScenarios[id] ?? sensorScenarios.normal;
}
