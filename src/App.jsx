import { useGame } from './context/GameContext';
import StarBackground from './components/shared/StarBackground';
import SplashScreen from './components/screens/SplashScreen';
import BriefingScreen from './components/screens/BriefingScreen';
import MapScreen from './components/screens/MapScreen';
import RoomScreen from './components/screens/RoomScreen';
import CodeEntryScreen from './components/screens/CodeEntryScreen';
import VictoryScreen from './components/screens/VictoryScreen';
import TimeUpScreen from './components/screens/TimeUpScreen';

/**
 * Main App — renders current screen based on gameState.
 */
export default function App() {
  const { state } = useGame();

  const screens = {
    splash:   SplashScreen,
    briefing: BriefingScreen,
    map:      MapScreen,
    room:     RoomScreen,
    code:     CodeEntryScreen,
    victory:  VictoryScreen,
    timeup:   TimeUpScreen,
  };

  const CurrentScreen = screens[state.currentScreen] || SplashScreen;

  return (
    <div className="relative min-h-dvh overflow-hidden" dir="rtl" lang="he">
      <StarBackground />
      <div className="relative z-10 screen-transition-enter" key={state.currentScreen + (state.currentRoom || '')}>
        <CurrentScreen />
      </div>
    </div>
  );
}
