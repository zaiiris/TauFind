export const simulationScenarios = {
  safeHike: {
    id: 'safe-hike',
    name: 'Safe hike scenario',
    description: 'A prepared hiker in stable conditions with healthy readings.',
    route: {
      id: 'medeu-shymbulak',
      name: 'Medeu–Shymbulak',
      difficulty: 'Moderate',
      altitude: 2260,
    },
    weather: {
      condition: 'Clear',
      temperature: 12,
    },
    sensors: {
      heartRate: 92,
      movementStatus: 'Hiking normally',
      batteryLevel: 88,
    },
    hiker: {
      experienceLevel: 'Intermediate',
      equipmentReadiness: 100,
    },
  },
  increasingRisk: {
    id: 'increasing-risk',
    name: 'Increasing risk scenario',
    description: 'Weather is worsening while the hiker shows signs of exertion.',
    route: {
      id: 'kolsai',
      name: 'Kolsai Lakes',
      difficulty: 'Moderate',
      altitude: 2250,
    },
    weather: {
      condition: 'Rain showers',
      temperature: 5,
    },
    sensors: {
      heartRate: 158,
      movementStatus: 'Movement slowing',
      batteryLevel: 34,
    },
    hiker: {
      experienceLevel: 'Beginner',
      equipmentReadiness: 80,
    },
  },
  emergency: {
    id: 'emergency',
    name: 'Emergency scenario',
    description: 'A fall, absent movement, severe conditions, and low battery.',
    route: {
      id: 'sairam-ugam',
      name: 'Sairam-Ugam',
      difficulty: 'Challenging',
      altitude: 3400,
    },
    weather: {
      condition: 'Blizzard',
      temperature: -12,
    },
    sensors: {
      heartRate: 188,
      movementStatus: 'Fall detected — no movement',
      batteryLevel: 8,
    },
    hiker: {
      experienceLevel: 'Beginner',
      equipmentReadiness: 60,
    },
  },
}

export const getSimulationScenario = (scenarioId) =>
  Object.values(simulationScenarios).find(
    (scenario) => scenario.id === scenarioId,
  )
