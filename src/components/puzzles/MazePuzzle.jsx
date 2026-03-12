import { useState, useCallback, useEffect } from 'react';
import { useGame, ACTIONS } from '../../context/GameContext';
import { ROOMS, MAZE_GRID, MAZE_STARS, MAZE_START, MAZE_END, MAZE_SUM } from '../../constants';
import HintSystem from '../shared/HintSystem';
import SuccessOverlay from '../shared/SuccessOverlay';

const GRID_SIZE = 7;
const CELL = 44; // min touch target

/**
 * Maze Puzzle — Navigate spaceship through asteroid field.
 * Collect 3 stars (2+3+4=9), reach the end, enter sum.
 */
export default function MazePuzzle() {
  const { state, dispatch } = useGame();
  const room = ROOMS.navigation;
  const navStatus = state.roomStatus.navigation;
  const playerPos = navStatus.playerPos;
  const collectedStars = navStatus.collectedStars;

  const [shaking, setShaking] = useState(false);
  const [showSumInput, setShowSumInput] = useState(false);
  const [sumAnswer, setSumAnswer] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassiveHint, setShowPassiveHint] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);

  const allStarsCollected = collectedStars.length === MAZE_STARS.length;

  // Check for star collection at current position
  useEffect(() => {
    MAZE_STARS.forEach((star) => {
      const key = `${star.x}-${star.y}`;
      if (playerPos.x === star.x && playerPos.y === star.y && !collectedStars.includes(key)) {
        dispatch({ type: ACTIONS.COLLECT_STAR, payload: key });
      }
    });

    // Check if reached end
    if (playerPos.x === MAZE_END.x && playerPos.y === MAZE_END.y && !reachedEnd) {
      setReachedEnd(true);
      if (allStarsCollected || collectedStars.length === MAZE_STARS.length - 1) {
        // Check again with potential new star
        setTimeout(() => setShowSumInput(true), 500);
      }
    }
  }, [playerPos, collectedStars, dispatch, allStarsCollected, reachedEnd]);

  // Also show sum when all stars collected AND at end
  useEffect(() => {
    if (collectedStars.length === MAZE_STARS.length && playerPos.x === MAZE_END.x && playerPos.y === MAZE_END.y) {
      setTimeout(() => setShowSumInput(true), 500);
    }
  }, [collectedStars, playerPos]);

  const move = useCallback((dx, dy) => {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    // Bounds check
    if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) return;

    // Asteroid check
    if (MAZE_GRID[newY][newX] === 1) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }

    dispatch({ type: ACTIONS.MOVE_PLAYER, payload: { x: newX, y: newY } });
  }, [playerPos, dispatch]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (showSumInput) return;
      switch (e.key) {
        case 'ArrowUp':    e.preventDefault(); move(0, -1); break;
        case 'ArrowDown':  e.preventDefault(); move(0, 1); break;
        case 'ArrowLeft':  e.preventDefault(); move(-1, 0); break;
        case 'ArrowRight': e.preventDefault(); move(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move, showSumInput]);

  const handleSumSubmit = () => {
    if (parseInt(sumAnswer) === MAZE_SUM) {
      setShowSuccess(true);
      dispatch({
        type: ACTIONS.SOLVE_ROOM,
        payload: { roomId: 'navigation', digit: room.digit, digitIndex: room.digitIndex },
      });
    } else {
      setShaking(true);
      dispatch({ type: ACTIONS.INCREMENT_ATTEMPT, payload: 'navigation' });
      setTimeout(() => setShaking(false), 500);
    }
  };

  const handleContinue = () => {
    dispatch({ type: ACTIONS.LEAVE_ROOM });
  };

  if (showSuccess) {
    return <SuccessOverlay digit={room.digit} digitIndex={room.digitIndex} onContinue={handleContinue} />;
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Story */}
      <p className="text-game-base font-body text-ui-text mb-4 animate-slide-up text-center">
        נַוְּטוּ אֶת הַחַלָּלִית דֶּרֶךְ שְׂדֵה אַסְטֶרוֹאִידִים! אִסְפוּ אֶת הַכּוֹכָבִים בַּדֶּרֶךְ.
      </p>

      {/* Star collection status */}
      <div className="flex justify-center gap-3 mb-4 animate-slide-up stagger-2">
        {MAZE_STARS.map((star, i) => {
          const key = `${star.x}-${star.y}`;
          const collected = collectedStars.includes(key);
          return (
            <div
              key={i}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                collected ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-space-light/30 text-ui-dim/40'
              }`}
            >
              ⭐ {collected ? star.value : '?'}
            </div>
          );
        })}
      </div>

      {/* Maze grid */}
      <div className={`flex justify-center mb-6 animate-fade-in ${shaking ? 'animate-shake' : ''}`}>
        <div
          className="grid gap-0.5 p-2 bg-space-deep rounded-xl border border-accent-cyan/20"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL}px)`,
          }}
        >
          {MAZE_GRID.map((row, y) =>
            row.map((cell, x) => {
              const isPlayer = playerPos.x === x && playerPos.y === y;
              const isEnd = x === MAZE_END.x && y === MAZE_END.y;
              const star = MAZE_STARS.find((s) => s.x === x && s.y === y);
              const starKey = star ? `${star.x}-${star.y}` : null;
              const starCollected = starKey && collectedStars.includes(starKey);
              const isAsteroid = cell === 1;
              // Transparent asteroid hint
              const isHintAsteroid = x === 1 && y === 0;

              return (
                <div
                  key={`${x}-${y}`}
                  className={`
                    flex items-center justify-center rounded-md text-lg
                    transition-colors duration-200
                    ${isAsteroid ? 'bg-ui-dim/20' : 'bg-space-light/20'}
                    ${isPlayer ? 'bg-accent-cyan/20' : ''}
                    ${isEnd ? 'bg-accent-orange/10' : ''}
                  `}
                  style={{ width: CELL, height: CELL }}
                  onClick={() => {
                    if (isHintAsteroid && isAsteroid) setShowPassiveHint(true);
                  }}
                >
                  {isPlayer && (
                    <span className="text-2xl animate-float" style={{ animationDuration: '2s' }}>🚀</span>
                  )}
                  {isAsteroid && !isPlayer && (
                    <span className={`text-xl ${isHintAsteroid ? 'opacity-30 animate-breathe cursor-pointer' : 'opacity-60'}`}>
                      🪨
                    </span>
                  )}
                  {star && !starCollected && !isPlayer && (
                    <span className="text-xl animate-twinkle">⭐</span>
                  )}
                  {isEnd && !isPlayer && (
                    <span className="text-xl animate-glow-pulse" style={{ color: '#FF8A5C' }}>🏁</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Direction buttons */}
      {!showSumInput && (
        <div className="flex flex-col items-center gap-2 mb-6 animate-slide-up stagger-3">
          <button
            onClick={() => move(0, -1)}
            className="w-14 h-14 rounded-xl bg-space-light border border-accent-cyan/30 text-accent-cyan text-2xl font-bold clickable-area focus-ring active:scale-90 transition-transform"
            aria-label="לְמַעְלָה"
          >
            ↑
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => move(1, 0)}
              className="w-14 h-14 rounded-xl bg-space-light border border-accent-cyan/30 text-accent-cyan text-2xl font-bold clickable-area focus-ring active:scale-90 transition-transform"
              aria-label="יָמִינָה"
            >
              →
            </button>
            <button
              onClick={() => move(0, 1)}
              className="w-14 h-14 rounded-xl bg-space-light border border-accent-cyan/30 text-accent-cyan text-2xl font-bold clickable-area focus-ring active:scale-90 transition-transform"
              aria-label="לְמַטָּה"
            >
              ↓
            </button>
            <button
              onClick={() => move(-1, 0)}
              className="w-14 h-14 rounded-xl bg-space-light border border-accent-cyan/30 text-accent-cyan text-2xl font-bold clickable-area focus-ring active:scale-90 transition-transform"
              aria-label="שְׂמֹאלָה"
            >
              ←
            </button>
          </div>
        </div>
      )}

      {/* Sum question — appears when reached end with all stars */}
      {showSumInput && (
        <div className={`text-center animate-bounce-in ${shaking ? 'animate-shake' : ''}`}>
          <p className="text-game-base font-body text-ui-text mb-2">
            הַסִּפְרוֹת עַל הַכּוֹכָבִים הֵן: <span className="text-accent-cyan font-bold">2, 3, 4</span>
          </p>
          <p className="text-game-lg font-display font-bold text-accent-orange mb-4">
            כַּמָּה זֶה בְּיַחַד?
          </p>

          <div className="flex items-center justify-center gap-3">
            <input
              type="number"
              value={sumAnswer}
              onChange={(e) => setSumAnswer(e.target.value)}
              className="w-20 h-14 rounded-xl bg-space-light border-2 border-accent-cyan/30 text-center text-game-xl font-display font-bold text-accent-cyan focus:border-accent-cyan focus:outline-none"
              aria-label="סְכוּם הַכּוֹכָבִים"
            />
            <button
              onClick={handleSumSubmit}
              disabled={!sumAnswer}
              className={`px-6 py-3 rounded-xl font-display font-bold text-game-base clickable-area focus-ring transition-all ${
                sumAnswer ? 'bg-accent-orange text-space-deep' : 'bg-ui-dim/30 text-ui-dim cursor-not-allowed'
              }`}
            >
              בָּדוֹק! ⭐
            </button>
          </div>

          {shaking && (
            <p className="mt-3 text-ui-danger text-game-sm font-body animate-fade-in">
              לֹא מְדוּיָק... נַסּוּ לְחַבֵּר שׁוּב! 🧮
            </p>
          )}
        </div>
      )}

      {/* Passive hint */}
      {showPassiveHint && (
        <div className="fixed bottom-24 right-4 left-4 md:left-auto md:right-8 md:max-w-sm z-40 animate-bounce-in">
          <div className="bg-space-light/95 backdrop-blur-sm border border-accent-cyan/30 rounded-2xl p-4 text-game-sm text-ui-text shadow-lg">
            <button onClick={() => setShowPassiveHint(false)} className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center text-ui-dim hover:text-ui-text">✕</button>
            <p className="font-body">🧭 נַסּוּ לָלֶכֶת יָמִינָה וּלְמַטָּה — הַמָּסְלוּל הַבָּטוּחַ עוֹבֵר דֶּרֶךְ הַכּוֹכָבִים!</p>
          </div>
        </div>
      )}

      <HintSystem
        passiveHint="🧭 הַמָּסְלוּל הַבָּטוּחַ עוֹבֵר דֶּרֶךְ הַכּוֹכָבִים!"
        activeHint="לְכוּ יָמִינָה וּלְמַטָּה. אִם נִתְקַעְתֶּם, נַסּוּ כִּוּוּן אַחֵר. הַכּוֹכָבִים נִמְצָאִים בְּאֶמְצַע הַמָּבוֹךְ. 2 + 3 + 4 = ?"
      />
    </div>
  );
}
