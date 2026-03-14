import React from 'react';
import { LeavesBg, Waves } from '../shared';

export default function SplashScreen({ onStart }) {
  return (
    <div className="screen bg-ocean">
      <LeavesBg />
      <Waves color="rgba(62,216,201,0.2)" />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: 20 }}>
        <div className="anim-fadeInUp" style={{ fontSize: '4rem' }}>🏝️</div>

        <h1
          className="title anim-fadeInUp stagger-1"
          style={{ color: 'var(--gold)', fontSize: '2.2rem', textShadow: '0 2px 20px rgba(242,201,76,.3)' }}
        >
          הָאִי הַמִּסְתּוֹרִי
        </h1>

        <p className="anim-fadeInUp stagger-2" style={{ color: 'var(--turquoise)', fontSize: '1.1rem', fontWeight: 700 }}>
          חֲדַר בְּרִיחָה דִּיגִיטָלִי
        </p>

        <button
          className="btn btn-primary anim-fadeInUp stagger-4"
          onClick={onStart}
          style={{ fontSize: '1.4rem', padding: '18px 40px', marginTop: 20 }}
        >
          🌊 יַאלְלָה, מַפְלִיגִים!
        </button>

        <a
          href="/escaperoom/"
          className="anim-fadeInUp stagger-5"
          style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', textDecoration: 'none', marginTop: 8 }}
        >
          ← כָּל חֲדָרֵי הַבְּרִיחָה
        </a>
      </div>
    </div>
  );
}
