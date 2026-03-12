/**
 * Glowing button with hover/tap pulse animation.
 * Used across all screens for primary actions.
 */
export default function GlowButton({
  children,
  onClick,
  color = 'orange',
  size = 'lg',
  className = '',
  disabled = false,
  ariaLabel,
}) {
  const colorStyles = {
    orange: 'bg-accent-orange text-space-deep hover:shadow-[0_0_20px_rgba(255,138,92,0.6)] active:shadow-[0_0_30px_rgba(255,138,92,0.8)]',
    cyan:   'bg-accent-cyan text-space-deep hover:shadow-[0_0_20px_rgba(78,234,221,0.6)] active:shadow-[0_0_30px_rgba(78,234,221,0.8)]',
    purple: 'bg-accent-purple text-space-deep hover:shadow-[0_0_20px_rgba(167,139,250,0.6)] active:shadow-[0_0_30px_rgba(167,139,250,0.8)]',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-game-sm rounded-lg',
    md: 'px-6 py-3 text-game-base rounded-xl',
    lg: 'px-8 py-4 text-game-lg rounded-2xl',
    xl: 'px-10 py-5 text-game-xl rounded-2xl',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        font-display font-bold
        clickable-area focus-ring
        transition-all duration-300 ease-out
        transform active:scale-95
        ${colorStyles[color] || colorStyles.orange}
        ${sizeStyles[size] || sizeStyles.lg}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
