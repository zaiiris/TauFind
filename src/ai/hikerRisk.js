import { calculateRisk } from "./riskEngine";
import { getRouteById } from "../data/routes";
import { simulationScenarios } from "../data/simulationData";

export function parseRouteWeather(weather = "") {
  const temperatureMatch = weather.match(/-?\d+/);
  return {
    condition: weather.split("·")[1]?.trim() || "Unknown conditions",
    temperature: temperatureMatch ? Number(temperatureMatch[0]) : 10,
  };
}

export function getEquipmentReadiness(route, equipment = []) {
  if (!route?.requiredEquipment?.length) return 0;
  const packed = route.requiredEquipment.filter((item) => equipment.includes(item));
  return Math.round((packed.length / route.requiredEquipment.length) * 100);
}

export function getHikerRisk(state) {
  const route = getRouteById(state.trip.selectedRoute);
  if (!route) return null;

  const weather = parseRouteWeather(route.weather);
  const sensors = simulationScenarios.safeHike.sensors;
  const equipmentReadiness = getEquipmentReadiness(route, state.trip.equipment);

  return calculateRisk({
    experienceLevel: state.user.experience,
    routeName: route.name,
    routeDifficulty: route.difficulty,
    altitude: route.altitude,
    weatherCondition: weather.condition,
    temperature: weather.temperature,
    equipmentReadiness,
    heartRate: sensors.heartRate,
    movementStatus: sensors.movementStatus,
    batteryLevel: sensors.batteryLevel,
  });
}

export function getPreparationScore(state) {
  const profileChecks = [
    state.user.name,
    state.user.age,
    state.user.experience,
    state.user.emergencyContact.name,
    state.user.emergencyContact.phone,
  ];
  const tripChecks = [state.trip.selectedRoute, state.trip.date, state.trip.duration];
  const equipmentScore = Math.min(state.trip.equipment.length / 5, 1);
  const completed = profileChecks.filter(Boolean).length + tripChecks.filter(Boolean).length + equipmentScore * 2;
  return Math.round((completed / 10) * 100);
}
