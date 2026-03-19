import { ZONE_ORDER, ZONE_DATA } from '../data/gameData';

/* ─── initial state factory ─── */
export function getInitialState() {
  return {
    currentScreen: 'splash',   // splash | briefing | map | zone | code | victory
    currentZone: null,
    digits: [null, null, null, null, null],
    raftParts: [false, false, false, false, false],
    zoneStatus: {
      jungle:    { solved: false, attempts: 0 },
      parrots:   { solved: false, phase: 'pattern' },
      waterfall: { solved: false, attempts: 0 },
      cave:      { solved: false, phase: 'hunt', foundPieces: [] },
      beach:     { solved: false, phase: 'map' },
    },
    timer: { startTime: null, elapsed: 0, running: false },
    hints: { passive: 0, active: 0 },
  };
}

/* ─── reducer ─── */
export function gameReducer(state, action) {
  switch (action.type) {

    case 'SET_SCREEN':
      return {
        ...state,
        currentScreen: action.screen,
        currentZone: action.zone ?? null,
      };

    case 'START_TIMER':
      return {
        ...state,
        timer: { ...state.timer, startTime: Date.now(), running: true },
      };

    case 'TICK': {
      if (!state.timer.running || !state.timer.startTime) return state;
      return {
        ...state,
        timer: {
          ...state.timer,
          elapsed: Math.floor((Date.now() - state.timer.startTime) / 1000),
        },
      };
    }

    case 'SOLVE_ZONE': {
      const idx = ZONE_ORDER.indexOf(action.zone);
      if (idx === -1) return state;
      const digits = [...state.digits];
      digits[idx] = ZONE_DATA[action.zone].digit;
      const parts = [...state.raftParts];
      parts[idx] = true;
      return {
        ...state,
        digits,
        raftParts: parts,
        zoneStatus: {
          ...state.zoneStatus,
          [action.zone]: { ...state.zoneStatus[action.zone], solved: true },
        },
      };
    }

    case 'UPDATE_ZONE':
      return {
        ...state,
        zoneStatus: {
          ...state.zoneStatus,
          [action.zone]: { ...state.zoneStatus[action.zone], ...action.data },
        },
      };

    case 'USE_HINT':
      return {
        ...state,
        hints: {
          ...state.hints,
          [action.hintType]: state.hints[action.hintType] + 1,
        },
      };

    case 'RESET':
      return getInitialState();

    default:
      return state;
  }
}
