import React, { useReducer } from 'react';
import { gameReducer, getInitialState } from './data/gameReducer';
import { useGameTimer } from './hooks/useGameTimer';
import {
  SplashScreen,
  BriefingScreen,
  MapScreen,
  ZoneScreen,
  CodeEntryScreen,
  VictoryScreen,
} from './components/screens';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, getInitialState);

  /* keep timer ticking */
  useGameTimer(state.timer.running, dispatch);

  const go = (screen, zone) => dispatch({ type: 'SET_SCREEN', screen, zone });

  switch (state.currentScreen) {
    case 'splash':
      return <SplashScreen onStart={() => go('briefing')} />;

    case 'briefing':
      return (
        <BriefingScreen
          onContinue={() => {
            dispatch({ type: 'START_TIMER' });
            go('map');
          }}
        />
      );

    case 'map':
      return <MapScreen state={state} dispatch={dispatch} />;

    case 'zone':
      return <ZoneScreen zone={state.currentZone} state={state} dispatch={dispatch} />;

    case 'code':
      return <CodeEntryScreen state={state} dispatch={dispatch} />;

    case 'victory':
      return <VictoryScreen state={state} dispatch={dispatch} />;

    default:
      return <SplashScreen onStart={() => go('briefing')} />;
  }
}
