const WEIGHTS = {
  environment: 0.25,
  healthSensors: 0.25,
  routeDifficulty: 0.2,
  experience: 0.2,
  equipment: 0.1,
}

const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value))

const numberOr = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const interpolate = (value, start, end, startScore, endScore) => {
  const progress = clamp((value - start) / (end - start), 0, 1)
  return startScore + progress * (endScore - startScore)
}

const getAltitudeRisk = (altitude) => {
  if (altitude <= 1500) return 5
  if (altitude <= 2000) return interpolate(altitude, 1500, 2000, 5, 20)
  if (altitude <= 2500) return interpolate(altitude, 2000, 2500, 20, 45)
  if (altitude <= 3000) return interpolate(altitude, 2500, 3000, 45, 70)
  if (altitude <= 3500) return interpolate(altitude, 3000, 3500, 70, 90)
  return 95
}

const getWeatherRisk = (condition = '') => {
  const weather = String(condition).toLowerCase()

  if (/storm|blizzard|thunder|avalanche/.test(weather)) return 95
  if (/heavy snow|whiteout|ice/.test(weather)) return 82
  if (/heavy rain/.test(weather)) return 76
  if (/strong wind|windy/.test(weather)) return 62
  if (/rain|showers|snow/.test(weather)) return 55
  if (/fog|mist/.test(weather)) return 48
  if (/cloud|overcast/.test(weather)) return 28
  if (/clear|sunny/.test(weather)) return 8
  return 35
}

const getTemperatureRisk = (temperature) => {
  if (temperature <= -15 || temperature >= 38) return 95
  if (temperature <= -5) return interpolate(temperature, -15, -5, 95, 72)
  if (temperature < 2) return interpolate(temperature, -5, 2, 72, 48)
  if (temperature <= 25) return 8
  if (temperature <= 32) return interpolate(temperature, 25, 32, 8, 45)
  return interpolate(temperature, 32, 38, 45, 95)
}

const getMovementRisk = (status = '') => {
  const movement = String(status).toLowerCase()

  if (/fall detected|fallen/.test(movement)) return 100
  if (/no movement|unresponsive/.test(movement)) return 85
  if (/slowing|unstable|irregular/.test(movement)) return 48
  if (/stationary|resting/.test(movement)) return 20
  if (/normal|hiking|moving/.test(movement)) return 8
  return 30
}

const getHeartRateRisk = (heartRate, movementStatus) => {
  const isStationary = /stationary|resting|no movement|unresponsive/i.test(
    movementStatus,
  )

  if (heartRate <= 35 || heartRate >= 185) return 100
  if (heartRate <= 45 || heartRate >= 170) return 88
  if (heartRate >= 155) return 68
  if (isStationary && heartRate >= 125) return 76
  if (heartRate >= 135) return 42
  if (heartRate < 50) return 58
  return 10
}

const getBatteryRisk = (batteryLevel) => {
  if (batteryLevel <= 10) return 100
  if (batteryLevel <= 20) return 82
  if (batteryLevel <= 40) return 48
  if (batteryLevel <= 60) return 24
  return 6
}

const experienceRisk = {
  beginner: 75,
  intermediate: 35,
  advanced: 10,
  professional: 5,
}

const routeRisk = {
  easy: 10,
  moderate: 40,
  challenging: 75,
  difficult: 75,
  extreme: 95,
}

const getRiskLevel = (score) => {
  if (score >= 75) return 'Critical'
  if (score >= 55) return 'High'
  if (score >= 30) return 'Medium'
  return 'Low'
}

const createFactor = (id, label, weight, categoryScore, explanation) => {
  const contribution = categoryScore * weight

  return {
    id,
    label,
    weight: Math.round(weight * 100),
    categoryScore: Math.round(categoryScore),
    contribution: Number(contribution.toFixed(1)),
    severity: getRiskLevel(categoryScore),
    explanation,
  }
}

export function calculateRisk(input = {}) {
  const experience = String(input.experienceLevel || 'beginner').toLowerCase()
  const difficulty = String(input.routeDifficulty || 'moderate').toLowerCase()
  const altitude = numberOr(input.altitude, 2000)
  const weatherCondition = input.weatherCondition || 'Unknown conditions'
  const temperature = numberOr(input.temperature, 10)
  const equipmentReadiness = clamp(numberOr(input.equipmentReadiness, 0))
  const heartRate = numberOr(input.heartRate, 80)
  const movementStatus = input.movementStatus || 'Normal movement'
  const batteryLevel = clamp(numberOr(input.batteryLevel, 100))

  const altitudeScore = getAltitudeRisk(altitude)
  const weatherScore = getWeatherRisk(weatherCondition)
  const temperatureScore = getTemperatureRisk(temperature)
  const environmentScore =
    altitudeScore * 0.4 + weatherScore * 0.35 + temperatureScore * 0.25

  const heartRateScore = getHeartRateRisk(heartRate, movementStatus)
  const movementScore = getMovementRisk(movementStatus)
  const batteryScore = getBatteryRisk(batteryLevel)
  const healthScore =
    heartRateScore * 0.55 + movementScore * 0.35 + batteryScore * 0.1

  const routeScore = routeRisk[difficulty] ?? 50
  const userExperienceScore = experienceRisk[experience] ?? 60
  const equipmentScore = 100 - equipmentReadiness

  const factors = [
    createFactor(
      'environment',
      'Mountain environment',
      WEIGHTS.environment,
      environmentScore,
      `${altitude.toLocaleString()} m altitude, ${String(weatherCondition).toLowerCase()}, and ${temperature}°C produce an environmental risk of ${Math.round(environmentScore)}/100.`,
    ),
    createFactor(
      'healthSensors',
      'Health & bracelet signals',
      WEIGHTS.healthSensors,
      healthScore,
      `${heartRate} bpm, ${String(movementStatus).toLowerCase()}, and ${batteryLevel}% bracelet battery produce a sensor risk of ${Math.round(healthScore)}/100.`,
    ),
    createFactor(
      'routeDifficulty',
      'Route difficulty',
      WEIGHTS.routeDifficulty,
      routeScore,
      `${input.routeName || 'The selected route'} is rated ${difficulty}, producing a route risk of ${routeScore}/100.`,
    ),
    createFactor(
      'experience',
      'Hiker experience',
      WEIGHTS.experience,
      userExperienceScore,
      `${experience.charAt(0).toUpperCase() + experience.slice(1)} experience produces a preparedness risk of ${userExperienceScore}/100.`,
    ),
    createFactor(
      'equipment',
      'Equipment readiness',
      WEIGHTS.equipment,
      equipmentScore,
      `${Math.round(equipmentReadiness)}% of required equipment is ready, leaving an equipment risk of ${Math.round(equipmentScore)}/100.`,
    ),
  ]

  const score = Math.round(
    factors.reduce((total, factor) => total + factor.contribution, 0),
  )
  const riskLevel = getRiskLevel(score)
  const recommendations = []

  if (environmentScore >= 45) {
    recommendations.push(
      `Review the forecast and altitude plan: ${weatherCondition.toLowerCase()} at ${altitude.toLocaleString()} m increases exposure.`,
    )
  }
  if (healthScore >= 45) {
    recommendations.push(
      `Pause and verify bracelet readings (${heartRate} bpm, ${movementStatus.toLowerCase()}, ${batteryLevel}% battery) before departure.`,
    )
  }
  if (routeScore >= 70) {
    recommendations.push(
      'Use a guide or choose a lower-difficulty route that matches the group’s ability.',
    )
  }
  if (userExperienceScore >= 60) {
    recommendations.push(
      'Share the route with an experienced hiking partner and avoid travelling alone.',
    )
  }
  if (equipmentReadiness < 100) {
    recommendations.push(
      `Complete the equipment checklist before starting; readiness is currently ${Math.round(equipmentReadiness)}%.`,
    )
  }
  if (batteryLevel < 40) {
    recommendations.push(
      'Charge the TauFind bracelet above 80% so monitoring and LoRa alerts remain available.',
    )
  }
  if (recommendations.length === 0) {
    recommendations.push(
      'Preparation looks strong. Keep weather alerts active and follow the planned route.',
    )
  }

  return {
    score,
    riskLevel,
    factors,
    recommendations,
  }
}

export { WEIGHTS }
