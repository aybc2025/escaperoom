import { useEffect } from 'react';
import GlowButton from './GlowButton';
import Confetti from './Confetti';

/**
 * Overlay shown when a puzzle is solved.
 * Displays the discovered digit with celebration animation.
 */
export default function SuccessOverlay({ digit, digitIndex, onContinue }) {
  const ordinals = ['הָרִאשׁוֹנָה', 'הַשְּׁנִיָּה', 'הַשְּׁלִישִׁית', 'הָרְבִיעִית'];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-space-deep/80 backdrop-blur-sm animate-fade-in" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 animate-bounce-in">
        <Confetti active={true} />

        {/* Spark ring */}
        <div className="mx-auto w-32 h-32 rounded-full border-4 border-accent-cyan glow-border flex items-center justify-center mb-6 animate-glow-pulse">
          <span className="text-game-3xl font-display font-bold text-accent-cyan glow-text">
            {digit}
          </span>
        </div>

        <h2 className="text-game-xl font-display font-bold text-accent-orange mb-3 animate-slide-up">
          מָצָאתָ! 🎉
        </h2>
        <p className="text-game-base font-body text-ui-text mb-8 animate-slide-up stagger-2">
          הַסִּפְרָה {ordinals[digitIndex]} הִיא{' '}
          <span className="text-accent-cyan font-bold">{digit}</span>!
        </p>

        <div className="animate-slide-up stagger-3">
          <GlowButton onClick={onContinue} color="orange">
            🗺️ חֲזָרָה לַמַּפָּה
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
