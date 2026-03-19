import React from 'react';
import { LeavesBg } from '../shared';

export default function BriefingScreen({ onContinue }) {
  return (
    <div className="screen bg-ocean" style={{ padding: 20 }}>
      <LeavesBg />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 420, width: '100%', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
        <div className="anim-fadeInUp" style={{ fontSize: '3rem' }}>📜</div>
        <div className="subtitle anim-fadeInUp stagger-1">הוֹדָעָה מִבַּקְבּוּק!</div>

        <div className="puzzle-instruction anim-fadeInUp stagger-2">
          <p className="nikud">
            אוֹי לֹא! הַסְּעָרָה הָרְסָה אֶת הַסִּירָה שֶׁלְּךָ וְנִסְחַפְתָּ לְאִי מִסְתּוֹרִי.
            אֲבָל אַל תִּדְאַג — מָצָאתָ עַל הַחוֹף שְׁרִידֵי רַפְסוֹדָה יְשָׁנָה!
          </p>
          <p className="nikud" style={{ marginTop: 12 }}>
            הִיא מְחוּבֶּרֶת בְּשַׁרְשֶׁרֶת עִם מַנְעוּל בֶּן 5 סִפְרוֹת.
            הַסִּפְרוֹת מֻסְתָּרוֹת בְּ-5 מְקוֹמוֹת שׁוֹנִים בָּאִי.
          </p>
          <p className="nikud" style={{ marginTop: 12, color: 'var(--sunset)', fontWeight: 700 }}>
            מִצְאוּ אוֹתָן לִפְנֵי הַשְּׁקִיעָה!
          </p>
        </div>

        <button className="btn btn-primary anim-fadeInUp stagger-4" onClick={onContinue}>
          הֵבַנְתִּי, יוֹצֵא לַחֲפֹשׂ! 🔍
        </button>
      </div>
    </div>
  );
}
