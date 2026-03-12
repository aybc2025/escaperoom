import { useGame, ACTIONS } from '../../context/GameContext';
import { ROOMS } from '../../constants';
import SandTimer from '../shared/SandTimer';
import CountingPuzzle from '../puzzles/CountingPuzzle';
import CipherPuzzle from '../puzzles/CipherPuzzle';
import DifferencesPuzzle from '../puzzles/DifferencesPuzzle';
import MazePuzzle from '../puzzles/MazePuzzle';

/**
 * Generic room wrapper — renders header + story + puzzle based on currentRoom.
 */
export default function RoomScreen() {
  const { state, dispatch } = useGame();
  const { currentRoom } = state;
  const room = ROOMS[currentRoom];

  if (!room) return null;

  const puzzleComponents = {
    telescope: CountingPuzzle,
    comms: CipherPuzzle,
    lab: DifferencesPuzzle,
    navigation: MazePuzzle,
  };

  const PuzzleComponent = puzzleComponents[currentRoom];

  return (
    <div className="relative z-10 min-h-dvh flex flex-col screen-transition-enter">
      {/* Room header */}
      <header className="flex items-center justify-between px-4 py-2 h-12 border-b border-accent-cyan/10 bg-space-deep/60 backdrop-blur-sm">
        {/* Back to map */}
        <button
          onClick={() => dispatch({ type: ACTIONS.LEAVE_ROOM })}
          className="flex items-center gap-2 text-accent-cyan clickable-area focus-ring rounded-lg px-2 py-1"
          aria-label="חֲזָרָה לַמַּפָּה"
        >
          <span className="text-lg">🚀</span>
          <span className="text-sm font-display font-bold hidden sm:inline">מַפָּה</span>
        </button>

        {/* Room name */}
        <h1 className="text-game-sm font-display font-bold text-ui-text">
          {room.icon} {room.name}
        </h1>

        {/* Timer */}
        <SandTimer compact />
      </header>

      {/* Puzzle area */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        {PuzzleComponent && <PuzzleComponent />}
      </main>
    </div>
  );
}
