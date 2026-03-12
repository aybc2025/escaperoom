import { useGame, ACTIONS } from '../../context/GameContext';
import { ROOMS, ROOM_ORDER } from '../../constants';
import SandTimer from '../shared/SandTimer';
import GlowButton from '../shared/GlowButton';

/**
 * Space station map — hub screen with 4 clickable modules.
 * Shows code progress and timer.
 */
export default function MapScreen() {
  const { state, dispatch } = useGame();
  const { digits, roomStatus } = state;
  const allSolved = digits.every((d) => d !== null);

  // Module positions around a central lock (responsive grid)
  const modulePositions = [
    { gridArea: '1 / 1 / 2 / 2' }, // top-right
    { gridArea: '1 / 2 / 2 / 3' }, // top-left
    { gridArea: '2 / 1 / 3 / 2' }, // bottom-right
    { gridArea: '2 / 2 / 3 / 3' }, // bottom-left
  ];

  return (
    <div className="relative z-10 min-h-dvh flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 h-12 border-b border-accent-cyan/10 bg-space-deep/60 backdrop-blur-sm">
        <div className="text-game-sm font-display font-bold text-accent-cyan">
          🚀 תַּחֲנַת כּוֹכָב-7
        </div>
        <SandTimer compact />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-6">
        {/* Station title */}
        <h2 className="text-game-lg font-display font-bold text-ui-text animate-fade-in">
          מַפַּת הַתַּחֲנָה
        </h2>

        {/* Station modules grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-md">
          {ROOM_ORDER.map((roomId, i) => {
            const room = ROOMS[roomId];
            const status = roomStatus[roomId];
            const solved = status.solved;

            return (
              <button
                key={roomId}
                onClick={() => {
                  if (!solved) {
                    dispatch({ type: ACTIONS.ENTER_ROOM, payload: roomId });
                  }
                }}
                disabled={solved}
                aria-label={`${room.name} — ${solved ? 'נִפְתַּר' : 'לֹא נִפְתַּר'}`}
                className={`
                  relative aspect-square rounded-2xl border-2 p-4
                  flex flex-col items-center justify-center gap-2
                  transition-all duration-300 clickable-area focus-ring
                  animate-slide-up
                  ${solved
                    ? 'border-ui-success/50 bg-ui-success/10 cursor-default'
                    : 'border-accent-cyan/30 bg-space-light/50 hover:bg-space-light/80 hover:border-accent-cyan/60 cursor-pointer animate-glow-pulse'
                  }
                `}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  ...(solved ? {} : { color: '#4EEADD' }),
                }}
              >
                {/* Icon */}
                <span className="text-4xl md:text-5xl">{room.icon}</span>

                {/* Name */}
                <span className={`text-game-sm font-display font-bold text-center ${solved ? 'text-ui-success' : 'text-ui-text'}`}>
                  {room.name}
                </span>

                {/* Solved badge */}
                {solved && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-ui-success/20 rounded-full px-2 py-1">
                    <span className="text-ui-success text-sm">✓</span>
                    <span className="text-ui-success text-sm font-bold">{digits[room.digitIndex]}</span>
                  </div>
                )}

                {/* Unsolved pulse indicator */}
                {!solved && (
                  <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-accent-cyan animate-breathe" />
                )}
              </button>
            );
          })}
        </div>

        {/* Central code display */}
        <div className="mt-4 animate-fade-in">
          <p className="text-game-sm text-ui-dim text-center mb-3 font-body">הַקּוֹד הַסּוֹדִי:</p>
          <div className="flex gap-3 justify-center" dir="ltr">
            {digits.map((d, i) => (
              <div
                key={i}
                className={`
                  w-14 h-16 md:w-16 md:h-20 rounded-xl border-2 
                  flex items-center justify-center
                  text-game-xl font-display font-bold
                  transition-all duration-500
                  ${d !== null
                    ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan glow-border'
                    : 'border-ui-dim/30 bg-space-light/30 text-ui-dim/30'
                  }
                `}
              >
                {d !== null ? d : '?'}
              </div>
            ))}
          </div>
        </div>

        {/* Enter code button — appears when all rooms solved */}
        {allSolved && (
          <div className="mt-6 animate-bounce-in">
            <GlowButton
              onClick={() => dispatch({ type: ACTIONS.GO_TO_SCREEN, payload: 'code' })}
              color="orange"
              size="lg"
              ariaLabel="הַזֵן קוֹד וְהַפְעֵל מְנוֹעוֹת"
            >
              🔐 הַזֵן קוֹד וְהַפְעֵל מְנוֹעוֹת!
            </GlowButton>
          </div>
        )}
      </main>

      {/* Footer — digit progress dots */}
      <footer className="flex justify-center gap-3 pb-4">
        {digits.map((d, i) => (
          <div
            key={i}
            className={`
              w-4 h-4 rounded-full transition-all duration-500
              ${d !== null ? 'bg-accent-cyan shadow-[0_0_8px_#4EEADD]' : 'bg-ui-dim/30 border border-ui-dim/30'}
            `}
          />
        ))}
      </footer>
    </div>
  );
}
