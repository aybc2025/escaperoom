import { useTimer } from '../../hooks/useTimer';

/**
 * Miniature hourglass timer displayed in the header.
 * Shows animated sand and remaining time.
 */
export default function SandTimer({ compact = false }) {
  const { minutes, seconds, formattedTime, remaining } = useTimer();
  const isLow = remaining < 5 * 60; // under 5 minutes
  const isCritical = remaining < 2 * 60; // under 2 minutes

  return (
    <div
      className={`flex items-center gap-2 ${compact ? 'scale-90' : ''}`}
      aria-label={`נִשְׁאֲרוּ ${minutes} דַּקּוֹת וְ-${seconds} שְׁנִיּוֹת`}
      role="timer"
    >
      {/* Hourglass SVG */}
      <svg
        width={compact ? 20 : 28}
        height={compact ? 28 : 36}
        viewBox="0 0 28 36"
        className={isCritical ? 'text-ui-danger' : isLow ? 'text-accent-orange' : 'text-accent-cyan'}
      >
        {/* Frame */}
        <rect x="2" y="0" width="24" height="3" rx="1" fill="currentColor" opacity="0.8" />
        <rect x="2" y="33" width="24" height="3" rx="1" fill="currentColor" opacity="0.8" />
        
        {/* Glass shape */}
        <path
          d="M5 3 L5 12 L14 18 L5 24 L5 33 L23 33 L23 24 L14 18 L23 12 L23 3 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
        />
        
        {/* Sand (top) — shrinks based on time */}
        <path
          d="M7 5 L7 10 L14 16 L21 10 L21 5 Z"
          fill="currentColor"
          opacity="0.3"
          style={{
            transformOrigin: 'center top',
            transform: `scaleY(${Math.max(0, remaining / (25 * 60))})`,
            transition: 'transform 1s linear',
          }}
        />
        
        {/* Sand (bottom) — grows based on time */}
        <path
          d="M7 31 L7 26 L14 20 L21 26 L21 31 Z"
          fill="currentColor"
          opacity="0.4"
          style={{
            transformOrigin: 'center bottom',
            transform: `scaleY(${1 - Math.max(0, remaining / (25 * 60))})`,
            transition: 'transform 1s linear',
          }}
        />
        
        {/* Falling sand stream */}
        <line
          x1="14" y1="16" x2="14" y2="20"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
          className="animate-sand-flow"
        />
      </svg>

      {/* Digital time */}
      <span
        className={`
          font-display font-bold tabular-nums
          ${compact ? 'text-game-sm' : 'text-game-base'}
          ${isCritical ? 'text-ui-danger animate-breathe' : isLow ? 'text-accent-orange' : 'text-accent-cyan'}
        `}
        dir="ltr"
      >
        {formattedTime}
      </span>
    </div>
  );
}
