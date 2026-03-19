import React, { useState } from 'react';
import { LeavesBg, Waves, Confetti } from '../shared';

export default function CodeEntryScreen({ state, dispatch }) {
  const [animating, setAnimating] = useState(false);
  const [done, setDone] = useState(false);

  const handleUnlock = () => {
    setAnimating(true);
    setTimeout(() => {
      setDone(true);
      setTimeout(() => dispatch({ type: 'SET_SCREEN', screen: 'victory' }), 2000);
    }, 2000);
  };

  return (
    <div className="screen bg-beach" style={{ gap: 24 }}>
      <LeavesBg />
      <Waves color="rgba(62,216,201,0.25)" />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div className="anim-fadeInUp" style={{ fontSize: '3.5rem' }}>🔓</div>
        <h2 className="subtitle anim-fadeInUp stagger-1">הַזִינוּ אֶת הַקּוֹד!</h2>

        <div className="code-slots anim-fadeInUp stagger-2" style={{ gap: 12 }}>
          {state.digits.map((d, i) => (
            <div key={i} className="code-slot filled" style={{ width: 48, height: 56, fontSize: '1.6rem' }}>
              {d}
            </div>
          ))}
        </div>

        {!animating && !done && (
          <button className="btn btn-primary anim-fadeInUp stagger-3" onClick={handleUnlock} style={{ fontSize: '1.3rem', padding: '16px 36px' }}>
            🚣 שַׁחְרְרוּ רַפְסוֹדָה!
          </button>
        )}

        {animating && !done && (
          <div className="anim-fadeIn" style={{ fontSize: '1.2rem', color: 'var(--gold)', textAlign: 'center' }}>
            ⛓️ הַשַּׁרְשֶׁרֶת נִפְתַּחַת...
          </div>
        )}

        {done && (
          <div className="anim-fadeInUp" style={{ fontSize: '2rem', textAlign: 'center' }}>
            🌊 הָרַפְסוֹדָה חוֹפְשִׁיָּה!
          </div>
        )}
      </div>

      <Confetti active={done} />
    </div>
  );
}
