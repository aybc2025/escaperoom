import { useState, useMemo, useCallback } from 'react';
import { useGame, ACTIONS } from '../../context/GameContext';
import { ROOMS, STAR_COLORS } from '../../constants';
import HintSystem from '../shared/HintSystem';
import SuccessOverlay from '../shared/SuccessOverlay';

/**
 * Counting Puzzle — Count orange stars in the observation window.
 * Answer: 6 orange stars.
 */
export default function CountingPuzzle() {
  const { state, dispatch } = useGame();
  const room = ROOMS.telescope;
  const isSolved = state.roomStatus.telescope.solved;

  const [answer, setAnswer] = useState('');
  const [shaking, setShaking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassiveHint, setShowPassiveHint] = useState(false);

  // Generate star positions (deterministic with useMemo)
  const stars = useMemo(() => {
    const result = [];
    const colorKeys = Object.keys(STAR_COLORS);
    let id = 0;

    colorKeys.forEach((colorKey) => {
      const { hex, count } = STAR_COLORS[colorKey];
      for (let i = 0; i < count; i++) {
        // Pseudo-random but deterministic positions
        const seed = id * 137.5;
        result.push({
          id: id++,
          color: colorKey,
          hex,
          x: 8 + ((seed * 7) % 84),
          y: 8 + ((seed * 13) % 80),
          size: colorKey === 'orange' && i === 0 ? 28 : 14 + (seed % 8), // First orange star is bigger (hint)
          delay: (id * 0.3) % 4,
          isHintStar: colorKey === 'orange' && i === 0,
        });
      }
    });
    return result;
  }, []);

  const handleSubmit = useCallback(() => {
    const num = parseInt(answer, 10);
    if (num === STAR_COLORS.orange.count) {
      setShowSuccess(true);
      dispatch({
        type: ACTIONS.SOLVE_ROOM,
        payload: { roomId: 'telescope', digit: room.digit, digitIndex: room.digitIndex },
      });
    } else {
      setShaking(true);
      dispatch({ type: ACTIONS.INCREMENT_ATTEMPT, payload: 'telescope' });
      setTimeout(() => setShaking(false), 500);
    }
  }, [answer, dispatch, room]);

  const handleContinue = () => {
    dispatch({ type: ACTIONS.LEAVE_ROOM });
  };

  if (showSuccess) {
    return <SuccessOverlay digit={room.digit} digitIndex={room.digitIndex} onContinue={handleContinue} />;
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Story intro */}
      <p className="text-game-base font-body text-ui-text mb-6 animate-slide-up text-center">
        הַטֶּלֶסְקוֹפּ זִהָה כּוֹכָבִים חֲדָשִׁים! סִפְרוּ אֶת הַכּוֹכָבִים הַכְּתוּמִים כְּדֵי לִמְצוֹא אֶת הַסִּפְרָה.
      </p>

      {/* Observation window */}
      <div
        className="relative w-full aspect-[4/3] rounded-2xl border-2 border-accent-cyan/40 bg-space-deep overflow-hidden mb-6 glow-border animate-fade-in"
        role="img"
        aria-label="חַלּוֹן תַּצְפִּית עִם כּוֹכָבִים צִבְעוֹנִיִּים"
      >
        {/* Stars */}
        {stars.map((star) => (
          <button
            key={star.id}
            onClick={() => {
              if (star.isHintStar) setShowPassiveHint(true);
            }}
            className={`absolute rounded-full ${star.isHintStar ? 'animate-breathe cursor-pointer' : 'cursor-default'}`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.hex,
              boxShadow: `0 0 ${star.size / 2}px ${star.hex}`,
              animation: `twinkle ${2 + star.delay}s ease-in-out ${star.delay}s infinite`,
            }}
            aria-hidden={!star.isHintStar}
            tabIndex={star.isHintStar ? 0 : -1}
          />
        ))}

        {/* Viewport frame decoration */}
        <div className="absolute inset-0 border-8 border-space-mid/50 rounded-2xl pointer-events-none" />
      </div>

      {/* Color legend */}
      <div className="flex justify-center gap-6 mb-4 animate-slide-up stagger-2">
        {Object.entries(STAR_COLORS).map(([key, { hex, name }]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: hex, boxShadow: `0 0 6px ${hex}` }}
            />
            <span className="text-sm text-ui-dim font-body">{name}</span>
          </div>
        ))}
      </div>

      {/* Question + input */}
      <div className={`text-center animate-slide-up stagger-3 ${shaking ? 'animate-shake' : ''}`}>
        <p className="text-game-lg font-display font-bold text-accent-orange mb-4">
          כַּמָּה כּוֹכָבִים כְּתוּמִים יֵשׁ?
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setAnswer((prev) => String(Math.max(0, (parseInt(prev) || 0) - 1)))}
            className="w-12 h-12 rounded-xl bg-space-light border border-accent-cyan/30 text-accent-cyan text-2xl font-bold clickable-area focus-ring"
            aria-label="הוֹרֵד מִסְפָּר"
          >
            −
          </button>

          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-20 h-14 rounded-xl bg-space-light border-2 border-accent-cyan/30 text-center text-game-xl font-display font-bold text-accent-cyan focus:border-accent-cyan focus:outline-none"
            min="0"
            max="20"
            aria-label="מִסְפַּר הַכּוֹכָבִים הַכְּתוּמִים"
          />

          <button
            onClick={() => setAnswer((prev) => String((parseInt(prev) || 0) + 1))}
            className="w-12 h-12 rounded-xl bg-space-light border border-accent-cyan/30 text-accent-cyan text-2xl font-bold clickable-area focus-ring"
            aria-label="הַעֲלֵה מִסְפָּר"
          >
            +
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!answer}
          className={`
            mt-6 px-8 py-3 rounded-xl font-display font-bold text-game-base
            transition-all duration-300 clickable-area focus-ring
            ${answer
              ? 'bg-accent-orange text-space-deep hover:shadow-[0_0_20px_rgba(255,138,92,0.6)]'
              : 'bg-ui-dim/30 text-ui-dim cursor-not-allowed'
            }
          `}
        >
          בָּדוֹק! ✨
        </button>

        {/* Error message */}
        {shaking && (
          <p className="mt-3 text-ui-danger text-game-sm font-body animate-fade-in">
            כִּמְעַט! נַסּוּ לִסְפּוֹר שׁוּב 🔭
          </p>
        )}
      </div>

      {/* Passive hint bubble */}
      {showPassiveHint && (
        <div className="fixed bottom-24 right-4 left-4 md:left-auto md:right-8 md:max-w-sm z-40 animate-bounce-in">
          <div className="bg-space-light/95 backdrop-blur-sm border border-accent-cyan/30 rounded-2xl p-4 text-game-sm text-ui-text shadow-lg">
            <button
              onClick={() => setShowPassiveHint(false)}
              className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center text-ui-dim hover:text-ui-text"
            >
              ✕
            </button>
            <p className="font-body">💡 טִיפּ: תִּסְפְּרוּ רַק אֶת הַכְּתוּמִים, אַל תִּתְבַּלְבְּלוּ מֵהָאֲחֵרִים!</p>
          </div>
        </div>
      )}

      <HintSystem
        passiveHint="💡 טִיפּ: תִּסְפְּרוּ רַק אֶת הַכְּתוּמִים!"
        activeHint="נַסּוּ לִסְפּוֹר לְאַט — יֵשׁ בֵּין 5 לְ-8 כּוֹכָבִים כְּתוּמִים. תִּסְתַּכְּלוּ טוֹב עַל הַצֶּבַע!"
      />
    </div>
  );
}
