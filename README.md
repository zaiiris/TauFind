<div align="center">

# TauFind

### Safety before SOS.

**An intelligent mountain safety ecosystem that detects danger before SOS, works in areas with unstable connectivity, and helps rescue teams respond faster.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Status](https://img.shields.io/badge/status-hackathon%20MVP-0F3D2E)
![License](https://img.shields.io/badge/license-TBD-D9A441)

</div>

TauFind is an AI-powered autonomous mountain rescue ecosystem designed to prevent emergencies before they happen. It combines a smart wearable bracelet, explainable risk prediction, offline LoRa communication simulation, and a rescue management platform in one connected safety journey.

## Problem

Millions of people explore mountains every year, but a safe trip can quickly become an emergency because of:

- Getting lost or deviating from a planned route
- Sudden weather changes
- Falls and injuries
- Hypothermia and dangerous exposure
- Missing or unstable mobile coverage
- Delayed rescue response

Most existing systems react only after a person is already in danger or reported missing.

> **The problem is not only finding a missing person. The problem is knowing where they are, what happened, and their condition.**

## Solution

TauFind connects prevention, monitoring, detection, and rescue through four coordinated layers.

### 1. Smart Bracelet

The wearable concept continuously provides safety telemetry:

- GPS tracking
- Movement and fall detection
- Heart-rate monitoring
- Temperature monitoring
- LoRa emergency communication

### 2. AI Risk Prediction Engine

TauFind analyzes route, environment, preparation, and wearable signals using deterministic, explainable scoring. It detects abnormal situations, reduces false alarms through multi-signal verification, and classifies the current state as:

- **Safe** — conditions remain within expected limits
- **Warning** — one or more signals require attention
- **Emergency** — combined evidence requires rescue escalation

### 3. Offline LoRa Rescue Communication

TauFind is designed for environments where cellular coverage cannot be trusted. The MVP visualizes an offline relay path:

```text
Tourist Bracelet
       ↓
Mountain LoRa Relay
       ↓
Mountain Station
       ↓
Rescue Team
```

The emergency packet can include location, incident probability, sensor readings, and the likely cause of danger.

### 4. Rescue Management Platform

The rescue-facing experience brings critical information into one operational view:

- Emergency and risk monitoring
- Hiker location and route progress
- User condition and sensor readings
- Incident context and likely cause
- Search and response assistance

## Key Features

| Feature | Description |
| --- | --- |
| AI danger detection | Evaluates environmental, route, preparation, movement, and health signals. |
| Emergency verification workflow | Cross-checks multiple indicators before escalating an incident. |
| Offline rescue communication | Simulates emergency delivery through LoRa when cellular service is unavailable. |
| Fall detection | Recognizes impact followed by absent or abnormal movement. |
| Health monitoring | Tracks simulated heart rate, temperature, battery, GPS, and movement telemetry. |
| Hiking risk analysis | Produces a deterministic score with visible factors and recommendations. |
| Rescue dashboard | Presents location, risk, condition, and response information for rescuers. |
| Emergency simulation scenarios | Demonstrates normal, warning, fall, and critical offline situations. |

## How It Works

1. The user creates a safety profile and starts a hiking session.
2. The bracelet collects location, movement, health, and environmental data.
3. TauFind AI continuously analyzes risk and explains contributing factors.
4. When danger is detected, the user receives an **“Are you safe?”** confirmation request.
5. If the user requests help or does not respond, emergency mode activates automatically.
6. The rescue packet is relayed through the simulated LoRa network to the rescue team.

## MVP Implementation

This hackathon MVP demonstrates:

- Smart bracelet and sensor simulation
- Explainable hiking risk engine
- Deterministic emergency detection engine
- AI verification and confirmation workflow
- Offline LoRa rescue communication simulation
- Rescue management experience

> **This MVP demonstrates the system logic and communication flow. It does not claim connection to real hardware or real rescue infrastructure.**

## Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | React, Vite, JavaScript | Fast, component-based product experience |
| Interface | Tailwind CSS, Framer Motion, Lucide React | Responsive design, animation, and visual communication |
| Navigation | React Router | End-to-end product journey |
| State | React Context, localStorage | Shared and persistent demo state |
| Hardware simulation | ESP32 concept, simulated sensors | Bracelet telemetry and device behavior |
| Communication | LoRa network simulation | Offline emergency packet relay |
| AI | Explainable weighted scoring engines | Transparent risk and emergency decisions |

## Emergency Detection Logic

TauFind does not generate random emergency percentages. Its deterministic engine evaluates:

- Movement and post-impact inactivity
- Heart rate
- Body position and fall state
- Environmental temperature
- Altitude and route context
- Existing hiking risk
- Device battery status

| State | Example interpretation |
| --- | --- |
| **Normal** | Safe hiking with expected movement and sensor values |
| **Warning** | Unusual activity, cold exposure, or elevated heart rate detected |
| **Emergency** | Fall + no movement + abnormal health or environmental indicators |

Every emergency decision includes a confidence level, possible cause, contributing factors, and a plain-language explanation.

## Demo Scenarios

1. **Normal Hiking** — stable movement, healthy heart rate, and active communication.
2. **Cold Environment** — temperature exposure increases the live risk level.
3. **High Heart Rate** — sustained cardiovascular stress triggers a warning.
4. **Fall Detection** — impact and no movement begin AI emergency verification.
5. **Emergency Activation** — no response triggers an offline LoRa rescue transmission.

## Project Architecture

```text
User
  ↓
Smart Bracelet
  ↓
AI Risk & Emergency Engines
  ↓
Offline Communication Layer
  ↓
Rescue Dashboard
```

The product journey follows the same safety model:

```text
Prevent → Monitor → Detect → Rescue
```

## Future Development

- Real ESP32 and LoRa hardware prototypes
- Solar-assisted bracelet and mountain-node charging
- Deployment of real mountain relay stations
- Integration with official rescue services
- Native mobile application and offline maps
- Advanced machine-learning models trained on field data
- Pilot programs with hikers, guides, and rescue organizations

## Why TauFind?

Traditional systems begin searching after people disappear. TauFind is designed to identify danger earlier, preserve communication beyond cellular coverage, and give rescuers the context they need to act faster.

> **Traditional systems search after people disappear. TauFind helps prevent emergencies before they happen.**

## Team

_Add team members, roles, and contact information here._

---

<div align="center">

**TauFind — Safety before SOS.**

</div>
