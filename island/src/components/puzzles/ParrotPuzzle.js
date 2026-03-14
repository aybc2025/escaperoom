import React, { useState } from 'react';

const COLORS = { red: '#E85D4A', blue: '#3B82F6', yellow: '#F2C94C', green: '#4AE88D', orange: '#FF7B4A' };

const BRANCHES = [
  ['red', 'blue', 'yellow', 'red', 'blue', 'yellow'],
  ['green', 'green', 'orange', 'green', 'green', 'orange'],
  ['blue', 'yellow', 'yellow', 'blue', 'yellow', 'yellow'],
  ['red', 'green', 'blue', 'yellow', 'red', 'green', 'blue', null],
];

const CORRECT_COLOR = 'yellow';

/* After filling in the missing yellow:
   yellow count per branch: 0→2, 1→0, 2→4, 3→2  total = 8 …
   BUT we want digit=5, so let's ask about ORANGE instead: branch-1 has 2 oranges. Total orange = 2.
   Let's ask about GREEN: 0→0, 1→4, 2→0, 3→2 = 6. Not 5.
   RED: 0→2, 3→2 = 4. Not 5.
   BLUE: 0→2, 2→2, 3→2 = 6. Not 5.
   
   Let's just change question to: "How many RED and ORANGE parrots together?" = 4+2 = 6. Still not 5.
   Simplest fix: tweak a branch so reds total 5.
   branch-0: red blue yellow red blue yellow  → 2 reds
   branch-3: red green blue yellow red green blue yellow → 2 reds
   add one more red somewhere… OR just ask "how many green parrots on the SECOND branch?" = 4. Not 5.
   
   OK easiest: ask total orange+red = 2+4 = 6. Nope.
   Let me just change branch-3 to have 3 reds: red green red yellow red green blue yellow → 3 reds. Total red = 5 ✓
*/

const BRANCHES_FINAL = [
  ['red', 'blue', 'yellow', 'red', 'blue', 'yellow'],
  ['green', 'green', 'orange', 'green', 'green', 'orange'],
  ['blue', 'yellow', 'yellow', 'blue', 'yellow', 'yellow'],
  ['red', 'green', 'red', 'yellow', 'red', 'green', 'blue', null], // 3 reds here
];

const COUNT_TARGET = 'red';
const COUNT_ANSWER = 5;   // branch0=2 + branch3=3

export default function ParrotPuzzle({ onSolve }) {
  const [phase, setPhase] = useState('pattern');
  const [selectedColor, setSelectedColor] = useState(null);
  const [patternFb, setPatternFb] = useState(null);
  const [countVal, setCountVal] = useState('');
  const [countFb, setCountFb] = useState(null);
  const [solved, setSolved] = useState(false);

  const checkPattern = () => {
    if (selectedColor === CORRECT_COLOR) {
      setPatternFb({ ok: true, text: 'נָכוֹן! הַתּוֹכִּים שָׂמְחִים! 🦜' });
      setTimeout(() => setPhase('count'), 1200);
    } else {
      setPatternFb({ ok: false, text: 'לֹא בְּדִיּוּק... הִסְתַּכְּלוּ עַל הַדֶּפֶס שׁוּב!' });
    }
  };

  const checkCount = () => {
    if (parseInt(countVal, 10) === COUNT_ANSWER) {
      setCountFb({ ok: true, text: 'מְצוּיָן! הַסִּפְרָה הִיא 5!' });
      setSolved(true);
      setTimeout(onSolve, 1500);
    } else {
      setCountFb({ ok: false, text: 'לֹא מְדוּיָּק. סִפְרוּ שׁוּב אֶת כָּל הָאֲדוּמִּים!' });
    }
  };

  const renderBranch = (colors, idx) => (
    <div className="branch-row" key={idx}>
      <div className="branch-bg" />
      {colors.map((color, i) =>
        color === null ? (
          <div key={i} className="parrot-slot">
            {selectedColor ? (
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: COLORS[selectedColor] }} />
            ) : '❓'}
          </div>
        ) : (
          <div key={i} className="parrot-circle" style={{ background: COLORS[color] }}>🦜</div>
        )
      )}
    </div>
  );

  if (phase === 'pattern') {
    return (
      <div className="puzzle-container">
        <div className="puzzle-instruction anim-fadeInUp">
          <p className="nikud">הַתּוֹכִּים יוֹשְׁבִים בְּסֵדֶר מְסוּיָּם. מָה הַצֶּבַע הַחָסֵר בָּעֵנָף הָאַחֲרוֹן?</p>
        </div>
        <div className="anim-fadeInUp stagger-1" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {BRANCHES_FINAL.map((b, i) => renderBranch(b, i))}
        </div>
        <div className="anim-fadeInUp stagger-2" style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--gold)' }}>בִּחְרוּ צֶבַע:</div>
        <div className="color-picker-row anim-fadeInUp stagger-3">
          {Object.entries(COLORS).map(([name, hex]) => (
            <div
              key={name}
              className="color-pick"
              style={{ background: hex, borderColor: selectedColor === name ? '#fff' : 'transparent', transform: selectedColor === name ? 'scale(1.2)' : 'scale(1)' }}
              onClick={() => setSelectedColor(name)}
            />
          ))}
        </div>
        <button className="btn btn-primary anim-fadeInUp stagger-4" onClick={checkPattern} disabled={!selectedColor}>בִּדְקוּ!</button>
        {patternFb && <div className={`feedback-bubble ${patternFb.ok ? 'feedback-success' : 'feedback-error'}`}>{patternFb.text}</div>}
      </div>
    );
  }

  /* count phase */
  return (
    <div className="puzzle-container">
      <div className="puzzle-instruction anim-fadeInUp">
        <p className="nikud">
          מְצוּיָן! עַכְשָׁיו סִפְרוּ — כַּמָּה תּוֹכִּים{' '}
          <span style={{ color: COLORS[COUNT_TARGET] }}>אֲדוּמִּים</span> יֵשׁ בְּכָל הָעֵץ?
        </p>
      </div>
      <div className="anim-fadeInUp stagger-1" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {BRANCHES_FINAL.map((b, i) => renderBranch(b.map((c) => (c === null ? CORRECT_COLOR : c)), i))}
      </div>
      <div className="count-input-area anim-fadeInUp stagger-2">
        <input className="count-input" type="number" min="0" max="20" value={countVal} onChange={(e) => setCountVal(e.target.value)} aria-label="מספר תוכים אדומים" />
        <button className="btn btn-primary btn-small" onClick={checkCount}>✓</button>
      </div>
      {countFb && <div className={`feedback-bubble ${countFb.ok ? 'feedback-success' : 'feedback-error'}`}>{countFb.text}</div>}
    </div>
  );
}
