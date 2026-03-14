import GlowButton from '../shared/GlowButton';
import { useGame, ACTIONS } from '../../context/GameContext';

/**
 * Splash/Title screen with logo and start button.
 */
export default function SplashScreen() {
  const { dispatch } = useGame();

  return (
    <div className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      {/* Animated rocket */}
      <div className="text-6xl md:text-7xl mb-4 animate-float">
        🚀
      </div>

      {/* Title */}
      <h1 className="text-game-2xl md:text-game-3xl font-display font-black text-accent-cyan glow-text mb-3 animate-slide-up">
        הַמְּשִׂימָה לְתַחֲנַת הַחָלָל
      </h1>

      {/* Subtitle */}
      <p className="text-game-lg font-display font-bold text-accent-purple mb-2 animate-slide-up stagger-2">
        תַּחֲנַת כּוֹכָב-7
      </p>

      {/* Tagline */}
      <p className="text-game-base text-ui-dim mb-12 animate-slide-up stagger-3">
        חֶדֶר בְּרִיחָה דִּיגִיטָלִי בַּחָלָל!
      </p>

      {/* Start button */}
      <div className="animate-slide-up stagger-4">
        <GlowButton
          onClick={() => dispatch({ type: ACTIONS.GO_TO_SCREEN, payload: 'briefing' })}
          size="xl"
          ariaLabel="הַתְחֵל מִשְׂימָה"
        >
          🚀 יַאלְלָה, מַתְחִילִים!
        </GlowButton>
      </div>

      {/* Decorative elements + home link */}
      <div className="absolute bottom-8 flex flex-col items-center gap-3 animate-fade-in stagger-6">
        <span className="text-ui-dim text-sm">25 דַּקּוֹת · 4 חֲדָרִים · קוֹד סוֹדִי</span>
        <a
          href="/escaperoom/"
          className="text-ui-dim text-xs hover:text-accent-cyan transition-colors"
          aria-label="חזרה לכל חדרי הבריחה"
        >
          ← כָּל חֲדָרֵי הַבְּרִיחָה
        </a>
      </div>
    </div>
  );
}
