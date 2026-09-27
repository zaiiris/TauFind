import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "taufind:app-state";
const STORAGE_VERSION = 2;

function createInitialState() {
  return {
    user: {
      name: "",
      age: "",
      country: "Kazakhstan",
      experience: "beginner",
      emergencyContact: {
        name: "",
        phone: "",
      },
    },
    trip: {
      selectedRoute: "",
      date: "",
      duration: "",
      groupSize: "1",
      equipment: [],
    },
    safety: {
      riskScore: 12,
      riskAnalysis: null,
      currentStatus: "safe",
      settings: {
        fallDetection: true,
        heartMonitoring: true,
        emergencyAlerts: true,
      },
      emergencyState: {
        active: false,
        type: null,
        acknowledged: false,
        currentScenario: "fallDetected",
        stage: "detecting",
        analysisProgress: 0,
        countdown: 10,
        rescueSignal: {
          status: "idle",
          progress: 0,
          offlineMode: true,
          received: false,
        },
      },
    },
    hiking: {
      active: true,
      scenario: "normal",
      warningScenario: "highHeartRate",
      progress: 36,
      elapsedSeconds: 5220,
    },
    demoPresentation: {
      active: false,
      playing: false,
      stageIndex: 0,
      completed: false,
    },
    demoBackup: null,
    platform: {
      currentRole: null,
      authentication: {
        isAuthenticated: false,
        email: "",
      },
      language: "en",
    },
    rescueOperation: {
      stage: 0,
      incidentId: null,
    },
    demoMode: false,
  };
}

const initialTauFindState = createInitialState();

function getDemoDate() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toISOString().slice(0, 10);
}

const TauFindContext = createContext(null);

function loadStoredState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialTauFindState;

    const parsed = JSON.parse(saved);
    if (parsed.version !== STORAGE_VERSION || !parsed.state) {
      return initialTauFindState;
    }

    return {
      user: {
        ...initialTauFindState.user,
        ...parsed.state.user,
        emergencyContact: {
          ...initialTauFindState.user.emergencyContact,
          ...parsed.state.user?.emergencyContact,
        },
      },
      trip: { ...initialTauFindState.trip, ...parsed.state.trip },
      safety: {
        ...initialTauFindState.safety,
        ...parsed.state.safety,
        emergencyState: {
          ...initialTauFindState.safety.emergencyState,
          ...parsed.state.safety?.emergencyState,
          rescueSignal: {
            ...initialTauFindState.safety.emergencyState.rescueSignal,
            ...parsed.state.safety?.emergencyState?.rescueSignal,
          },
        },
        settings: {
          ...initialTauFindState.safety.settings,
          ...parsed.state.safety?.settings,
        },
      },
      hiking: { ...initialTauFindState.hiking, ...parsed.state.hiking },
      demoPresentation: {
        ...initialTauFindState.demoPresentation,
        ...parsed.state.demoPresentation,
      },
      demoBackup: parsed.state.demoBackup ?? null,
      platform: {
        ...initialTauFindState.platform,
        ...parsed.state.platform,
        authentication: {
          ...initialTauFindState.platform.authentication,
          ...parsed.state.platform?.authentication,
        },
      },
      rescueOperation: {
        ...initialTauFindState.rescueOperation,
        ...parsed.state.rescueOperation,
      },
      demoMode: Boolean(parsed.state.demoMode),
    };
  } catch {
    return initialTauFindState;
  }
}

export function TauFindProvider({ children }) {
  const [state, setState] = useState(loadStoredState);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, state }),
    );
  }, [state]);

  const updateUser = useCallback((updates) => {
    setState((current) => ({
      ...current,
      user: {
        ...current.user,
        ...updates,
        emergencyContact: updates.emergencyContact
          ? { ...current.user.emergencyContact, ...updates.emergencyContact }
          : current.user.emergencyContact,
      },
    }));
  }, []);

  const updateTrip = useCallback((updates) => {
    setState((current) => ({
      ...current,
      trip: { ...current.trip, ...updates },
    }));
  }, []);

  const updateSafety = useCallback((updates) => {
    setState((current) => ({
      ...current,
      safety: {
        ...current.safety,
        ...updates,
        emergencyState: updates.emergencyState
          ? { ...current.safety.emergencyState, ...updates.emergencyState }
          : current.safety.emergencyState,
      },
    }));
  }, []);

  const updateHiking = useCallback((updates) => {
    setState((current) => ({
      ...current,
      hiking: {
        ...current.hiking,
        ...(typeof updates === "function" ? updates(current.hiking) : updates),
      },
    }));
  }, []);

  const updateEmergency = useCallback((updates) => {
    setState((current) => {
      const currentEmergency = current.safety.emergencyState;
      const nextUpdates = typeof updates === "function" ? updates(currentEmergency) : updates;
      return {
        ...current,
        safety: {
          ...current.safety,
          emergencyState: {
            ...currentEmergency,
            ...nextUpdates,
            rescueSignal: nextUpdates.rescueSignal
              ? { ...currentEmergency.rescueSignal, ...nextUpdates.rescueSignal }
              : currentEmergency.rescueSignal,
          },
        },
      };
    });
  }, []);

  const updateDemoPresentation = useCallback((updates) => {
    setState((current) => ({
      ...current,
      demoPresentation: {
        ...current.demoPresentation,
        ...(typeof updates === "function" ? updates(current.demoPresentation) : updates),
      },
    }));
  }, []);

  const endDemoPresentation = useCallback(() => {
    setState((current) => {
      const restored = current.demoBackup
        ? {
            user: current.demoBackup.user,
            trip: current.demoBackup.trip,
            safety: current.demoBackup.safety,
            hiking: current.demoBackup.hiking,
          }
        : {};

      return {
        ...current,
        ...restored,
        demoPresentation: { ...current.demoPresentation, active: false, playing: false },
        demoBackup: null,
        demoMode: false,
      };
    });
  }, []);

  const updatePlatform = useCallback((updates) => {
    setState((current) => ({
      ...current,
      platform: {
        ...current.platform,
        ...(typeof updates === "function" ? updates(current.platform) : updates),
      },
    }));
  }, []);

  const updateRescueOperation = useCallback((updates) => {
    setState((current) => ({
      ...current,
      rescueOperation: {
        ...current.rescueOperation,
        ...(typeof updates === "function" ? updates(current.rescueOperation) : updates),
      },
    }));
  }, []);

  const selectRole = useCallback((currentRole) => {
    setState((current) => ({
      ...current,
      platform: { ...current.platform, currentRole },
    }));
  }, []);

  const authenticate = useCallback(({ email, role }) => {
    setState((current) => ({
      ...current,
      platform: {
        ...current.platform,
        currentRole: role ?? current.platform.currentRole ?? "hiker",
        authentication: { isAuthenticated: true, email },
      },
    }));
  }, []);

  const logout = useCallback(() => {
    setState((current) => ({
      ...current,
      platform: {
        ...current.platform,
        authentication: { ...current.platform.authentication, isAuthenticated: false },
      },
    }));
  }, []);

  const loadDemoScenario = useCallback(() => {
    setState((current) => ({
      ...createInitialState(),
      platform: current.platform,
      demoBackup: current.demoBackup ?? {
        user: current.user,
        trip: current.trip,
        safety: current.safety,
        hiking: current.hiking,
      },
      user: {
        name: "Amina Sarsen",
        age: "17",
        country: "Kazakhstan",
        experience: "beginner",
        emergencyContact: {
          name: "Dana Sarsen",
          phone: "+7 701 555 0142",
        },
      },
      trip: {
        selectedRoute: "sairam-ugam",
        date: getDemoDate(),
        duration: "7",
        groupSize: "2",
        equipment: ["water", "first-aid", "warm-layers", "navigation"],
      },
      demoMode: true,
    }));
  }, []);

  const resetTauFind = useCallback(() => setState(createInitialState()), []);

  const value = useMemo(
    () => ({ state, updateUser, updateTrip, updateSafety, updateHiking, updateEmergency, updateDemoPresentation, endDemoPresentation, updatePlatform, updateRescueOperation, selectRole, authenticate, logout, loadDemoScenario, resetTauFind }),
    [state, updateUser, updateTrip, updateSafety, updateHiking, updateEmergency, updateDemoPresentation, endDemoPresentation, updatePlatform, updateRescueOperation, selectRole, authenticate, logout, loadDemoScenario, resetTauFind],
  );

  return <TauFindContext.Provider value={value}>{children}</TauFindContext.Provider>;
}

// The provider and its companion hook intentionally share this context module.
// eslint-disable-next-line react-refresh/only-export-components
export function useTauFind() {
  const context = useContext(TauFindContext);
  if (!context) {
    throw new Error("useTauFind must be used within a TauFindProvider");
  }
  return context;
}
