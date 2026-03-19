import React, { useState } from 'react';

/* Items in a horizontal row, positions 0–4 */
const SYMBOLS = [
  { id: 'palm',     emoji: '🌴', label: 'דֶּקֶל' },
  { id: 'mountain', emoji: '🏔️', label: 'הָר' },
  { id: 'skull',    emoji: '💀', label: 'גֻּלְגֹּלֶת' },
  { id: 'anchor',   emoji: '⚓', label: 'עוֹגֵן' },
  { id: 'star',     emoji: '⭐', label: 'כּוֹכָב' },
];

/*
  Clues:
  1. "הָאוֹצָר לֹא בַּקָּצֶה" → eliminates palm(0) and star(4)
  2. "הָאוֹצָר מִיָּמִין לַגּוּלְגֹּלֶת 💀" → skull at index 2, so must be index 3 or 4. With 4 gone → anchor(3)
  3. "הָאוֹצָר לֹא צָמוּד לָהָר 🏔️" → mountain at index 1, so not index 0 or 2. Confirms anchor(3)
  Answer: anchor
*/
const CORRECT_SYMBOL = 'anchor';
const MATH_ANSWER = 4;

export default function BeachPuzzle({ onSolve }) {
  const [phase, setPhase] = useState('map');
  const [selected, setSelected] = useState(null);
  const [eliminated, setEliminated] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [mathVal, setMathVal] = useState('');

  const checkMap = () => {
    if (selected === CORRECT_SYMBOL) {
      setFeedback({ ok: true, text: 'נָכוֹן! חוֹפְרִים כָּאן!' });
      setTimeout(() => { setPhase('math'); setFeedback(null); }, 1200);
    } else {
      setFeedback({ ok: false, text: 'לֹא כָּאן... קִרְאוּ שׁוּב אֶת הָרְמָזִים!' });
      if (!eliminated.includes(selected)) setEliminated([...eliminated, selected]);
    }
  };

  const checkMath = () => {
    if (parseInt(mathVal, 10) === MATH_ANSWER) {
      setFeedback({ ok: true, text: 'מְצוּיָן! הַסִּפְרָה הָאַחֲרוֹנָה הִיא 4!' });
      setTimeout(onSolve, 1500);
    } else {
      setFeedback({ ok: false, text: 'לֹא מְדוּיָּק... נַסּוּ שׁוּב!' });
    }
  };

  if (phase === 'map') {
    return (
      <div className="puzzle-container">
        <div className="puzzle-instruction anim-fadeInUp">
          <p className="nikud">מָצָאתֶם מַפָּה! אֵיפֹה הָאוֹצָר? קִרְאוּ אֶת הָרְמָזִים:</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }} className="anim-fadeInUp stagger-1">
          <div className="clue-card"><p className="nikud" style={{ fontSize: '0.9rem' }}>1. הָאוֹצָר לֹא בַּקָּצֶה</p></div>
          <div className="clue-card"><p className="nikud" style={{ fontSize: '0.9rem' }}>2. הָאוֹצָר מִיָּמִין לַגּוּלְגֹּלֶת 💀</p></div>
          <div className="clue-card"><p className="nikud" style={{ fontSize: '0.9rem' }}>3. הָאוֹצָר לֹא צָמוּד לָהָר 🏔️</p></div>
        </div>

        <div className="treasure-row anim-fadeInUp stagger-2">
          {SYMBOLS.map((s, i) => (
            <div
              key={s.id}
              className={`row-symbol ${eliminated.includes(s.id) ? 'eliminated' : ''} ${selected === s.id ? 'selected' : ''}`}
              onClick={() => setSelected(s.id)}
            >
              <span className="row-symbol-num">{i + 1}</span>
              <span className="row-symbol-emoji">{s.emoji}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-primary anim-fadeInUp stagger-3" onClick={checkMap} disabled={!selected}>
          ⛏️ חִפְרוּ כָּאן!
        </button>

        {feedback && <div className={`feedback-bubble ${feedback.ok ? 'feedback-success' : 'feedback-error'}`}>{feedback.text}</div>}
      </div>
    );
  }

  /* math phase */
  return (
    <div className="puzzle-container">
      <div className="puzzle-instruction anim-fadeInUp">
        <p className="nikud">מָצָאתֶם כַּד! אֲבָל הוּא סָגוּר. פִּתְרוּ אֶת הַחִידָה שֶׁעַל הַמִּכְסֶה:</p>
      </div>

      <div
        className="anim-fadeInUp stagger-1"
        style={{
          fontSize: '2rem', textAlign: 'center', padding: 20,
          background: 'rgba(0,0,0,.3)', borderRadius: 16,
          border: '2px solid var(--gold)', width: '100%', maxWidth: 300,
        }}
      >
        🐚 + 🐚 + 🐚 = 12
        <div style={{ fontSize: '1.5rem', marginTop: 12, color: 'var(--gold)' }}>🐚 = ?</div>
      </div>

      <div className="count-input-area anim-fadeInUp stagger-2">
        <input className="math-input" type="number" min="0" max="20" value={mathVal} onChange={(e) => setMathVal(e.target.value)} aria-label="תשובה" />
        <button className="btn btn-primary btn-small" onClick={checkMath}>✓</button>
      </div>

      {feedback && <div className={`feedback-bubble ${feedback.ok ? 'feedback-success' : 'feedback-error'}`}>{feedback.text}</div>}
    </div>
  );
}
