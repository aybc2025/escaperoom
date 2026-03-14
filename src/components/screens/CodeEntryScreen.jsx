import { useState } from 'react';
import { useGame, ACTIONS } from '../../context/GameContext';
import { useTimer } from '../../hooks/useTimer';
import GlowButton from '../shared/GlowButton';
import Confetti from '../shared/Confetti';

/**
 * Final code entry screen with 4 digit wheels.
 * Digits are pre-filled from solved rooms. Player activates engines.
 */
export default function CodeEntryScreen() {
  const { state, dispatch } = useGame();
  const { stop: stopTimer } = useTimer();
  const { digits } = state;
  const [activated, setActivated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleActivate = () => {
    setActivated(true);
    setShowConfetti(true);
    stopTimer();

    // Transition to victory after dramatic animation
    setTimeout(() => {
      dispatch({ type: ACTIONS.GO_TO_SCREEN, payload: 'victory' });
    }, 3500);
  };

  return (
    <div className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <Confetti active={showConfetti} />

      {!activated ? (
        <>
          {/* Lock icon */}
          <div className="text-6xl mb-4 animate-glow-pulse" style={{ color: '#4EEADD' }}>
            🔐
          </div>

          <h2 className="text-game-xl font-display font-bold text-accent-cyan mb-2 animate-slide-up">
            הַקּוֹד מוּכָן!
          </h2>
          <p className="text-game-base font-body text-ui-dim mb-8 animate-slide-up stagger-2">
            כָּל 4 הַסִּפְרוֹת נֶאֶסְפוּ. הַפְעֵל אֶת הַמְנוֹעִים!
          </p>

          {/* Code display */}
          <div className="flex gap-4 justify-center mb-10 animate-slide-up stagger-3" dir="ltr">
            {digits.map((d, i) => (
              <div
                key={i}
                className="w-16 h-20 md:w-20 md:h-24 rounded-xl border-2 border-accent-cyan bg-accent-cyan/10 flex items-center justify-center text-game-2xl font-display font-bold text-accent-cyan glow-border"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Activate button */}
          <div className="animate-slide-up stagger-4">
            <GlowButton onClick={handleActivate} color="orange" size="xl" ariaLabel="הַפְעֵל מְנוֹעִים">
              🔥 הַפְעֵל מְנוֹעִים!
            </GlowButton>
          </div>
        </>
      ) : (
        /* Engine activation animation */
        <div className="animate-fade-in">
          <div className="text-8xl mb-6 animate-engine-glow">🔥</div>
          <p className="text-game-xl font-display font-bold text-accent-orange animate-breathe glow-text">
            הַמְנוֹעִים נִדְלָקִים...
          </p>

          {/* Engine flame effects */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-8 h-20 rounded-full animate-engine-glow"
                style={{
                  background: `linear-gradient(to top, #FF8A5C, #FF6B6B, transparent)`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
