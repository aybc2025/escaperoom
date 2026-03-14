import React from 'react';
import { LeavesBg, Waves, Confetti } from '../shared';

export default function VictoryScreen({ state, dispatch }) {
  const { elapsed } = state.timer;
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const totalHints = state.hints.passive + state.hints.active;

  return (
    <div className="screen bg-ocean" style={{ gap: 20, padding: 24 }}>
      <LeavesBg />
      <Waves color="rgba(62,216,201,0.3)" />
      <Confetti active />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, maxWidth: 400 }}>
        <div className="anim-fadeInUp" style={{ fontSize: '4rem' }}>🏝️🚣🌊</div>

        <h1 className="title anim-fadeInUp stagger-1" style={{ color: 'var(--gold)', fontSize: '1.8rem' }}>
          כָּל הַכָּבוֹד, הַרְפַּתְקָן!
        </h1>

        <p className="anim-fadeInUp stagger-2" style={{ textAlign: 'center', fontSize: '1.1rem', lineHeight: 1.8 }}>
          בָּרַחְתָּ מֵהָאִי הַמִּסְתּוֹרִי!
        </p>

        <div className="anim-fadeInUp stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          <div className="victory-stat">
            <span className="stat-icon">⏱️</span>
            <span>זְמַן:</span>
            <span className="stat-value">{mins} דַּקּוֹת וְ-{secs} שְׁנִיּוֹת</span>
          </div>
          <div className="victory-stat">
            <span className="stat-icon">💡</span>
            <span>רְמָזִים:</span>
            <span className="stat-value">{totalHints}</span>
          </div>
          <div className="victory-stat">
            <span className="stat-icon">🔢</span>
            <span>הַקּוֹד:</span>
            <span className="stat-value">{state.digits.join(' - ')}</span>
          </div>
        </div>

        <button className="btn btn-primary anim-fadeInUp stagger-4" onClick={() => dispatch({ type: 'RESET' })}>
          🔄 שַׂחֵק שׁוּב!
        </button>

        <a
          href="/escaperoom/"
          className="anim-fadeInUp stagger-5"
          style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', textDecoration: 'none' }}
        >
          ← כָּל חֲדָרֵי הַבְּרִיחָה
        </a>
      </div>
    </div>
  );
}
