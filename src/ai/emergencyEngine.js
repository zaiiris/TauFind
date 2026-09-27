const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

const numberOr = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

function getSeverity(confidence) {
  if (confidence >= 80) return "Critical";
  if (confidence >= 65) return "High";
  if (confidence >= 20) return "Elevated";
  return "Low";
}

export function detectEmergency(input = {}) {
  const fallDetected = Boolean(input.fallDetected);
  const movementStatus = String(input.movementStatus || "Unknown movement");
  const movement = movementStatus.toLowerCase();
  const heartRate = numberOr(input.heartRate, 80);
  const temperature = numberOr(input.temperature, 10);
  const altitude = numberOr(input.altitude, 1500);
  const battery = clamp(numberOr(input.battery, 100));
  const riskScore = clamp(numberOr(input.riskScore, 0));
  const factors = [];
  let confidence = 0;

  if (fallDetected) {
    confidence += 36;
    factors.push("Bracelet accelerometer detected a high-impact fall");
  }

  if (/no movement|unresponsive|motionless/.test(movement)) {
    confidence += 24;
    factors.push("No movement detected after the event");
  } else if (/irregular|slow|slowing|unstable/.test(movement)) {
    confidence += 7;
    factors.push("Movement pattern is abnormal");
  }

  if (heartRate <= 45 || heartRate >= 175) {
    confidence += 18;
    factors.push(`Critical heart rate reading: ${heartRate} bpm`);
  } else if (heartRate < 55 || heartRate >= 150) {
    confidence += 12;
    factors.push(`Abnormal heart rate reading: ${heartRate} bpm`);
  }

  if (temperature <= -5) {
    confidence += 10;
    factors.push(`Severe cold exposure: ${temperature}°C`);
  } else if (temperature <= 2) {
    confidence += 5;
    factors.push(`Low ambient temperature: ${temperature}°C`);
  }

  if (riskScore >= 75) {
    confidence += 8;
    factors.push(`Existing live risk score is ${Math.round(riskScore)}%`);
  } else if (riskScore >= 50) {
    confidence += 4;
    factors.push(`Existing live risk score is elevated at ${Math.round(riskScore)}%`);
  }

  if (altitude >= 2500) {
    confidence += 2;
    factors.push(`Incident occurred at high altitude (${Math.round(altitude)} m)`);
  }

  if (battery <= 20) {
    confidence += 2;
    factors.push(`Bracelet battery is critically low at ${Math.round(battery)}%`);
  }

  confidence = clamp(Math.round(confidence));
  const emergency = confidence >= 65;
  const severity = getSeverity(confidence);

  let cause = "No confirmed emergency";
  if (fallDetected && temperature <= 2) {
    cause = "Possible fall with hypothermia risk";
  } else if (fallDetected && /no movement|unresponsive|motionless/.test(movement)) {
    cause = "Possible incapacitating fall";
  } else if (heartRate <= 45) {
    cause = "Possible medical emergency after a fall";
  } else if (heartRate >= 150) {
    cause = "Sustained cardiovascular stress";
  } else if (temperature <= -5) {
    cause = "Dangerous cold exposure";
  }

  const explanation = emergency
    ? `${factors.length} independent signals crossed the deterministic emergency threshold of 65%.`
    : `${factors.length || "No"} concerning signal${factors.length === 1 ? "" : "s"} detected; TauFind continues monitoring below the 65% emergency threshold.`;

  return {
    emergency,
    confidence,
    severity,
    status: emergency ? "Emergency confirmed" : severity === "Elevated" ? "Warning monitored" : "No emergency",
    cause,
    factors,
    explanation,
  };
}
