import { detectEmergency } from "../ai/emergencyEngine";
import { getEmergencyScenario } from "./emergencySimulation";
import { demoScenario } from "./demoScenario";
import { getRouteById } from "./routes";

const ACTIVE_STAGES = new Set(["verifying", "countdown", "transmitting", "received"]);

export function getRescueIncident(state) {
  const emergencyState = state.safety.emergencyState;
  const scenario = getEmergencyScenario(emergencyState.currentScenario);
  const decision = detectEmergency(scenario.input);
  const demoReachedRescue = state.demoPresentation.active && state.demoPresentation.stageIndex >= 4;
  const demoIncident = demoReachedRescue ? demoScenario.rescueIncident : null;
  const active = Boolean(
    emergencyState.active
      || emergencyState.rescueSignal.received
      || ACTIVE_STAGES.has(emergencyState.stage)
      || state.safety.currentStatus === "emergency",
  );
  const route = getRouteById(state.trip.selectedRoute) ?? getRouteById("kolsai");
  const rawCondition = demoIncident?.condition ?? scenario.input;
  const confidence = demoIncident?.confidence ?? Math.max(decision.confidence, scenario.input.riskScore >= 90 ? scenario.input.riskScore : 0);

  return {
    active,
    id: "001",
    incidentId: demoIncident?.incidentId ?? "TF-001",
    status: active ? "CRITICAL" : "STANDBY",
    priority: confidence >= 80 ? "CRITICAL" : confidence >= 65 ? "HIGH" : "MEDIUM",
    receivedAt: "10:43",
    route: route.name,
    region: route.region,
    cause: demoIncident?.cause ?? decision.cause,
    confidence,
    severity: demoIncident?.severity ?? decision.severity,
    factors: demoIncident?.factors ?? decision.factors,
    explanation: decision.explanation,
    recommendation: demoIncident?.recommendation ?? "Immediate rescue required.",
    tourist: {
      name: state.user.name || "Amina Sarsen",
      experience: state.user.experience || "Beginner",
      emergencyContactAvailable: Boolean(state.user.emergencyContact?.name || state.user.emergencyContact?.phone),
    },
    condition: {
      heartRate: rawCondition.heartRate,
      temperature: rawCondition.temperature,
      movementStatus: rawCondition.movementStatus,
      altitude: rawCondition.altitude,
      battery: rawCondition.battery,
      lora: emergencyState.rescueSignal.received ? "Packet received" : scenario.lora.status,
    },
    signal: emergencyState.rescueSignal,
    mobileNetwork: scenario.mobileNetwork,
    coordinates: {
      tourist: { x: 68, y: 34 },
      lastSignal: { x: 61, y: 42 },
      station: { x: 24, y: 72 },
      rescue: { x: 18, y: 82 },
    },
  };
}
