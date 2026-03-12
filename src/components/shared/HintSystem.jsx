import { useState } from 'react';
import { useInactivity } from '../../hooks/useInactivity';
import { ACTIVE_HINT_DELAY } from '../../constants';

/**
 * Two-tier hint system:
 * 1. Passive hint — hidden element with "breathing" animation (always available)
 * 2. Active hint — Commander Noga help button (appears after inactivity)
 */
export default function HintSystem({ passiveHint, activeHint }) {
  const [showPassive, setShowPassive] = useState(false);
  const [showActive, setShowActive] = useState(false);
  const isInactive = useInactivity(ACTIVE_HINT_DELAY);

  return (
    <>
      {/* Passive hint bubble — shown when clicked */}
      {showPassive && (
        <div className="fixed bottom-24 right-4 left-4 md:left-auto md:right-8 md:max-w-sm z-40 animate-bounce-in">
          <div className="bg-space-light/95 backdrop-blur-sm border border-accent-cyan/30 rounded-2xl p-4 text-game-sm text-ui-text shadow-lg">
            <button
              onClick={() => setShowPassive(false)}
              className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center text-ui-dim hover:text-ui-text clickable-area"
              aria-label="סְגוֹר רֶמֶז"
            >
              ✕
            </button>
            <p className="font-body pe-6">{passiveHint}</p>
          </div>
        </div>
      )}

      {/* Active hint — Commander Noga */}
      {isInactive && !showActive && (
        <button
          onClick={() => setShowActive(true)}
          className="fixed bottom-4 left-4 z-40 animate-bounce-in clickable-area focus-ring"
          aria-label="בַּקֵּשׁ רֶמֶז מֵהַמְפַקֶּדֶת נוֹגָה"
        >
          <div className="relative w-14 h-14 rounded-full bg-accent-purple/20 border-2 border-accent-purple flex items-center justify-center animate-glow-pulse text-accent-purple">
            <span className="text-2xl">👩‍🚀</span>
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent-orange text-space-deep text-xs font-bold flex items-center justify-center">
              ?
            </span>
          </div>
        </button>
      )}

      {showActive && (
        <div className="fixed bottom-24 left-4 right-4 md:right-auto md:left-8 md:max-w-sm z-40 animate-bounce-in">
          <div className="bg-space-light/95 backdrop-blur-sm border border-accent-purple/30 rounded-2xl p-4 text-game-sm text-ui-text shadow-lg">
            <button
              onClick={() => setShowActive(false)}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-ui-dim hover:text-ui-text clickable-area"
              aria-label="סְגוֹר רֶמֶז"
            >
              ✕
            </button>
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">👩‍🚀</span>
              <div>
                <p className="font-display font-bold text-accent-purple mb-1">הַמְפַקֶּדֶת נוֹגָה:</p>
                <p className="font-body">{activeHint}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden export for passive trigger */}
      <PassiveTrigger onTrigger={() => setShowPassive(true)} />
    </>
  );
}

/**
 * Invisible component that puzzle components can call
 * to trigger the passive hint display.
 */
function PassiveTrigger({ onTrigger }) {
  // This is just a placeholder — the actual trigger elements
  // are rendered inside each puzzle and call onPassiveHint
  return null;
}

// Export a simple trigger function helper
HintSystem.triggerPassive = null;
