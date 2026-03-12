import { createContext, useContext, useReducer } from 'react';

// ============================================================
// Initial State
// ============================================================
export const initialState = {
  currentScreen: 'splash', // splash | briefing | map | room | code | victory | timeup
  currentRoom: null,       // telescope | comms | lab | navigation
  digits: [null, null, null, null],
  roomStatus: {
    telescope:  { solved: false, attempts: 0 },
    comms:      { solved: false, attempts: 0 },
    lab:        { solved: false, foundDiffs: [] },
    navigation: { solved: false, playerPos: { x: 0, y: 0 }, collectedStars: [] },
  },
  timer: {
    startTime: null,
    elapsed: 0,
    running: false,
  },
  showConfetti: false,
};

// ============================================================
// Action Types
// ============================================================
export const ACTIONS = {
  GO_TO_SCREEN:     'GO_TO_SCREEN',
  ENTER_ROOM:       'ENTER_ROOM',
  LEAVE_ROOM:       'LEAVE_ROOM',
  SOLVE_ROOM:       'SOLVE_ROOM',
  INCREMENT_ATTEMPT:'INCREMENT_ATTEMPT',
  FIND_DIFFERENCE:  'FIND_DIFFERENCE',
  MOVE_PLAYER:      'MOVE_PLAYER',
  COLLECT_STAR:     'COLLECT_STAR',
  TICK_TIMER:       'TICK_TIMER',
  START_TIMER:      'START_TIMER',
  STOP_TIMER:       'STOP_TIMER',
  SHOW_CONFETTI:    'SHOW_CONFETTI',
  HIDE_CONFETTI:    'HIDE_CONFETTI',
  RESET_GAME:       'RESET_GAME',
  TIME_UP:          'TIME_UP',
};

// ============================================================
// Reducer
// ============================================================
export function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.GO_TO_SCREEN:
      return { ...state, currentScreen: action.payload };

    case ACTIONS.ENTER_ROOM:
      return {
        ...state,
        currentScreen: 'room',
        currentRoom: action.payload,
      };

    case ACTIONS.LEAVE_ROOM:
      return {
        ...state,
        currentScreen: 'map',
        currentRoom: null,
      };

    case ACTIONS.SOLVE_ROOM: {
      const { roomId, digit, digitIndex } = action.payload;
      const newDigits = [...state.digits];
      newDigits[digitIndex] = digit;
      return {
        ...state,
        digits: newDigits,
        roomStatus: {
          ...state.roomStatus,
          [roomId]: { ...state.roomStatus[roomId], solved: true },
        },
      };
    }

    case ACTIONS.INCREMENT_ATTEMPT: {
      const roomId = action.payload;
      return {
        ...state,
        roomStatus: {
          ...state.roomStatus,
          [roomId]: {
            ...state.roomStatus[roomId],
            attempts: (state.roomStatus[roomId].attempts || 0) + 1,
          },
        },
      };
    }

    case ACTIONS.FIND_DIFFERENCE: {
      const diffId = action.payload;
      const labStatus = state.roomStatus.lab;
      if (labStatus.foundDiffs.includes(diffId)) return state;
      return {
        ...state,
        roomStatus: {
          ...state.roomStatus,
          lab: {
            ...labStatus,
            foundDiffs: [...labStatus.foundDiffs, diffId],
          },
        },
      };
    }

    case ACTIONS.MOVE_PLAYER:
      return {
        ...state,
        roomStatus: {
          ...state.roomStatus,
          navigation: {
            ...state.roomStatus.navigation,
            playerPos: action.payload,
          },
        },
      };

    case ACTIONS.COLLECT_STAR: {
      const starKey = action.payload;
      const navStatus = state.roomStatus.navigation;
      if (navStatus.collectedStars.includes(starKey)) return state;
      return {
        ...state,
        roomStatus: {
          ...state.roomStatus,
          navigation: {
            ...navStatus,
            collectedStars: [...navStatus.collectedStars, starKey],
          },
        },
      };
    }

    case ACTIONS.START_TIMER:
      return {
        ...state,
        timer: { startTime: Date.now(), elapsed: 0, running: true },
      };

    case ACTIONS.TICK_TIMER:
      if (!state.timer.running || !state.timer.startTime) return state;
      return {
        ...state,
        timer: {
          ...state.timer,
          elapsed: Math.floor((Date.now() - state.timer.startTime) / 1000),
        },
      };

    case ACTIONS.STOP_TIMER:
      return {
        ...state,
        timer: { ...state.timer, running: false },
      };

    case ACTIONS.SHOW_CONFETTI:
      return { ...state, showConfetti: true };

    case ACTIONS.HIDE_CONFETTI:
      return { ...state, showConfetti: false };

    case ACTIONS.TIME_UP:
      return {
        ...state,
        currentScreen: 'timeup',
        timer: { ...state.timer, running: false },
      };

    case ACTIONS.RESET_GAME:
      return { ...initialState };

    default:
      return state;
  }
}

// ============================================================
// Context
// ============================================================
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
