import { useGame, ACTIONS } from '../../context/GameContext';
import GlowButton from '../shared/GlowButton';
import Confetti from '../shared/Confetti';

/**
 * Victory/celebration screen after completing all puzzles.
 */
export default function VictoryScreen() {
  const { state, dispatch } = useGame();
  const { timer } = state;

  const minutes = Math.floor(timer.elapsed / 60);
  const seconds = timer.elapsed % 60;

  const handleReplay = () => {
    dispatch({ type: ACTIONS.RESET_GAME });
  };

  return (
    <div className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <Confetti active={true} />

      {/* Trophy */}
      <div className="text-7xl md:text-8xl mb-4 animate-bounce-in">
        🏆
      </div>

      <h1 className="text-game-2xl md:text-game-3xl font-display font-black text-accent-orange glow-text mb-4 animate-slide-up">
        כָּל הַכָּבוֹד אַסְטְרוֹנָאוּט! 🚀
      </h1>

      <p className="text-game-lg font-body text-ui-text mb-3 animate-slide-up stagger-2">
        הִצַּלְתָּ אֶת תַּחֲנַת כּוֹכָב-7!
      </p>

      {/* Time display */}
      <div className="bg-space-light/50 rounded-2xl border border-accent-cyan/20 px-8 py-4 mb-8 animate-slide-up stagger-3">
        <p className="text-game-sm text-ui-dim mb-1 font-body">הַזְּמַן שֶׁלָּךְ:</p>
        <p className="text-game-xl font-display font-bold text-accent-cyan" dir="ltr">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
      </div>

      {/* Stars decoration */}
      <div className="flex gap-3 mb-8 animate-slide-up stagger-4">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className="text-4xl animate-twinkle"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            ⭐
          </span>
        ))}
      </div>

      {/* Replay + home buttons */}
      <div className="flex flex-col items-center gap-4 animate-slide-up stagger-5">
        <GlowButton onClick={handleReplay} color="purple" ariaLabel="שַׂחֵק שׁוּב">
          🔄 שַׂחֵק שׁוּב!
        </GlowButton>
        <a
          href="/escaperoom/"
          className="text-ui-dim text-sm hover:text-accent-cyan transition-colors"
          aria-label="חזרה לכל חדרי הבריחה"
        >
          ← כָּל חֲדָרֵי הַבְּרִיחָה
        </a>
      </div>
    </div>
  );
}
