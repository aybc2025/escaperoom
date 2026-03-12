import { useState, useEffect } from 'react';
import GlowButton from '../shared/GlowButton';
import { useGame, ACTIONS } from '../../context/GameContext';
import { useTimer } from '../../hooks/useTimer';

/**
 * Mission briefing from Commander Noga.
 * Typewriter-style text reveal on a "space computer" screen.
 */
export default function BriefingScreen() {
  const { dispatch } = useGame();
  const { start: startTimer } = useTimer();
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowText(true), 600);
    const t2 = setTimeout(() => setShowButton(true), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleStart = () => {
    startTimer();
    dispatch({ type: ACTIONS.GO_TO_SCREEN, payload: 'map' });
  };

  return (
    <div className="relative z-10 min-h-dvh flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Incoming message header */}
        <div className="flex items-center gap-3 mb-4 animate-slide-up">
          <div className="w-3 h-3 rounded-full bg-ui-success animate-breathe" />
          <span className="text-game-sm text-accent-cyan font-display font-bold tracking-wider">
            הוֹדָעָה נִכְנֶסֶת...
          </span>
        </div>

        {/* Computer screen frame */}
        <div className="relative rounded-2xl border border-accent-cyan/30 bg-space-mid/80 backdrop-blur-sm p-6 md:p-8 glow-border animate-fade-in">
          {/* LED indicators */}
          <div className="absolute top-3 left-3 flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-ui-success animate-breathe" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent-orange animate-breathe" style={{ animationDelay: '0.5s' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-breathe" style={{ animationDelay: '1s' }} />
          </div>

          {/* Commander avatar */}
          <div className="flex items-center gap-3 mb-5 pt-4">
            <div className="w-12 h-12 rounded-full bg-accent-purple/20 border-2 border-accent-purple flex items-center justify-center text-2xl">
              👩‍🚀
            </div>
            <div>
              <p className="font-display font-bold text-accent-purple text-game-base">הַמְפַקֶּדֶת נוֹגָה</p>
              <p className="text-ui-dim text-sm">תַּחֲנַת כּוֹכָב-7</p>
            </div>
          </div>

          {/* Message text */}
          {showText && (
            <div className="space-y-3 text-game-base font-body leading-relaxed animate-fade-in">
              <p>
                שָׁלוֹם אַסְטְרוֹנָאוּט! אֲנִי הַמְפַקֶּדֶת נוֹגָה.
              </p>
              <p className="animate-slide-up stagger-2">
                תַּחֲנַת הַחָלָל כּוֹכָב-7 בְּצָרוֹת! הַמְנוֹעוֹת כָּבוּ וַאֲנַחְנוּ צְרִיכִים <span className="text-accent-cyan font-bold">קוֹד סוֹדִי בֶּן 4 סִפְרוֹת</span> כְּדֵי לְהַפְעִיל אוֹתָם.
              </p>
              <p className="animate-slide-up stagger-3">
                הַקּוֹד מֻסְתָּר בְּ-<span className="text-accent-orange font-bold">4 תָּאִים שׁוֹנִים</span> שֶׁל הַתַּחֲנָה. בְּכָל תָּא מְחַכָּה חִידָה — פִּתְרוּ אוֹתָהּ וּמִצְאוּ סִפְרָה!
              </p>
              <p className="animate-slide-up stagger-4">
                אֲנִי סוֹמֶכֶת עָלֶיךָ! ⭐
              </p>
            </div>
          )}

          {/* Start button */}
          {showButton && (
            <div className="mt-8 text-center animate-slide-up">
              <GlowButton onClick={handleStart} ariaLabel="צֵא לַמְּשִׂימָה">
                🗺️ הֵבַנְתִּי, יוֹצֵא לַמְּשִׂימָה!
              </GlowButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
