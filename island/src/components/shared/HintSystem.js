import React, { useState } from 'react';

export default function HintSystem({
  passiveEmoji,
  passiveText,
  activeText,
  showActive,
  onPassiveUse,
  onActiveUse,
}) {
  const [showHint, setShowHint] = useState(false);
  const [passiveUsed, setPassiveUsed] = useState(false);

  const handlePassive = () => {
    setPassiveUsed(true);
    onPassiveUse();
  };

  const handleActive = () => {
    setShowHint((v) => !v);
    if (!showHint) onActiveUse();
  };

  return (
    <>
      {/* passive hint element */}
      {!passiveUsed && (
        <div
          className="passive-hint anim-breathe"
          onClick={handlePassive}
          style={{
            fontSize: '2rem',
            position: 'fixed',
            bottom: 80,
            right: 20,
            zIndex: 80,
            cursor: 'pointer',
          }}
          aria-label="רמז מוסתר"
        >
          {passiveEmoji}
        </div>
      )}

      {passiveUsed && passiveText && (
        <div
          className="feedback-bubble feedback-info anim-fadeInUp"
          style={{ fontSize: '0.9rem', maxWidth: 320 }}
        >
          {passiveText}
        </div>
      )}

      {/* active hint button */}
      {showActive && (
        <button className="hint-btn" onClick={handleActive} aria-label="רמז">
          🦜
        </button>
      )}
      {showHint && activeText && (
        <div className="hint-bubble" onClick={() => setShowHint(false)}>
          {activeText}
        </div>
      )}
    </>
  );
}
