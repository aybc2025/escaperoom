import { useGame, ACTIONS } from '../../context/GameContext';
import GlowButton from '../shared/GlowButton';

/**
 * Time's up screen — encouraging message with replay option.
 */
export default function TimeUpScreen() {
  const { dispatch } = useGame();

  return (
    <div className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      {/* Clock icon */}
      <div className="text-7xl mb-4 animate-float">
        ⏰
      </div>

      <h1 className="text-game-2xl font-display font-black text-accent-orange mb-4 animate-slide-up">
        הַזְּמַן נִגְמַר!
      </h1>

      <p className="text-game-base font-body text-ui-text mb-3 animate-slide-up stagger-2">
        לֹא נוֹרָא, אַסְטְרוֹנָאוּט! גַּם אַסְטְרוֹנָאוּטִים אֲמִתִּיִּים צְרִיכִים לִפְעָמִים יוֹתֵר מִנִּסָּיוֹן אֶחָד.
      </p>

      <p className="text-game-lg font-body text-accent-cyan mb-8 animate-slide-up stagger-3">
        רוֹצֶה לְנַסּוֹת שׁוּב? 💪
      </p>

      <div className="animate-slide-up stagger-4">
        <GlowButton
          onClick={() => dispatch({ type: ACTIONS.RESET_GAME })}
          color="orange"
          size="xl"
          ariaLabel="שַׂחֵק שׁוּב"
        >
          🚀 יַאלְלָה, עוֹד פַּעַם!
        </GlowButton>
      </div>
    </div>
  );
}
