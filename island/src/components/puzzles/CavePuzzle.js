import React, { useState, useRef } from 'react';

const OBJECTS = [
  { id: 'p1', emoji: '🪨', x: 15, y: 25, real: true },
  { id: 'p2', emoji: '🪨', x: 75, y: 60, real: true },
  { id: 'p3', emoji: '🪨', x: 40, y: 80, real: true },
  { id: 'p4', emoji: '🪨', x: 85, y: 20, real: true },
  { id: 'p5', emoji: '🪨', x: 25, y: 65, real: true },
  { id: 'd1', emoji: '🦴', x: 55, y: 35, real: false },
  { id: 'd2', emoji: '🪵', x: 30, y: 45, real: false },
  { id: 'd3', emoji: '🦇', x: 70, y: 15, real: false },
];

const PIECE_SYMBOLS = ['◆', '◇', '●', '○', '◈'];
const DOTS_ANSWER = 5;

export default function CavePuzzle({ onSolve }) {
  const [phase, setPhase] = useState('hunt');
  const [torch, setTorch] = useState({ x: 50, y: 50 });
  const [found, setFound] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [assembled, setAssembled] = useState([null, null, null, null, null]);
  const [selPiece, setSelPiece] = useState(null);
  const [countVal, setCountVal] = useState('');
  const areaRef = useRef(null);

  /* torch movement */
  const moveTorch = (e) => {
    if (!areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    setTorch({ x: ((cx - rect.left) / rect.width) * 100, y: ((cy - rect.top) / rect.height) * 100 });
  };

  const isLit = (ox, oy) => Math.hypot(ox - torch.x, oy - torch.y) < 18;

  const handleObj = (obj) => {
    if (found.includes(obj.id)) return;
    if (obj.real) {
      const next = [...found, obj.id];
      setFound(next);
      setFeedback({ ok: true, text: `מָצָאתָ שֶׁבֶר! ${next.length}/5` });
      setTimeout(() => setFeedback(null), 1000);
      if (next.length === 5) setTimeout(() => setPhase('assemble'), 1200);
    } else {
      setFeedback({ ok: false, text: obj.id === 'd3' ? 'זֶה עֲטַלֵּף יָשֵׁן! 🦇' : 'זֶה סְתָם חֵפֶץ מְשַׁעֲמֵם!' });
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const handleSlot = (idx) => {
    if (selPiece !== null && assembled[idx] === null) {
      const next = [...assembled];
      next[idx] = selPiece;
      setAssembled(next);
      setSelPiece(null);
      if (next.every((s) => s !== null)) setTimeout(() => setPhase('count'), 800);
    }
  };

  const checkCount = () => {
    if (parseInt(countVal, 10) === DOTS_ANSWER) {
      setFeedback({ ok: true, text: 'נָכוֹן! הַסִּפְרָה הִיא 5!' });
      setTimeout(onSolve, 1500);
    } else {
      setFeedback({ ok: false, text: 'סִפְרוּ שׁוּב אֶת הַנְּקוּדוֹת!' });
    }
  };

  /* ─── HUNT PHASE ─── */
  if (phase === 'hunt') {
    return (
      <div className="puzzle-container" style={{ height: '100%', padding: 0 }}>
        <div className="puzzle-instruction" style={{ margin: '8px 16px', zIndex: 20, position: 'relative' }}>
          <p className="nikud" style={{ fontSize: '0.95rem' }}>הָזִיזוּ אֶת הַלַּפִּיד וּמִצְאוּ 5 שִׁבְרֵי אֶבֶן! ({found.length}/5)</p>
        </div>

        <div
          className="cave-area"
          ref={areaRef}
          onMouseMove={moveTorch}
          onTouchMove={moveTorch}
          style={{ background: 'var(--cave-dark)', flex: 1 }}
        >
          <div className="torch-light" style={{ left: `${torch.x}%`, top: `${torch.y}%` }} />

          {OBJECTS.map((obj) => (
            <div
              key={obj.id}
              className={`cave-object ${isLit(obj.x, obj.y) ? 'lit' : ''} ${found.includes(obj.id) ? 'collected' : ''}`}
              style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
              onClick={() => isLit(obj.x, obj.y) && handleObj(obj)}
            >
              {obj.emoji}
            </div>
          ))}
        </div>

        {feedback && (
          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}>
            <div className={`feedback-bubble ${feedback.ok ? 'feedback-success' : 'feedback-error'}`}>{feedback.text}</div>
          </div>
        )}
      </div>
    );
  }

  /* ─── ASSEMBLE PHASE ─── */
  if (phase === 'assemble') {
    return (
      <div className="puzzle-container">
        <div className="puzzle-instruction anim-fadeInUp">
          <p className="nikud">הַרְכִּיבוּ אֶת לוּחַ הָאֶבֶן — לִחְצוּ עַל שֶׁבֶר וְאָז עַל מָקוֹם בַּמִּסְגֶּרֶת.</p>
        </div>

        <div className="piece-tray anim-fadeInUp stagger-1">
          {PIECE_SYMBOLS.map((sym, i) => (
            <div
              key={i}
              className={`piece-item ${selPiece === i ? 'selected' : ''} ${assembled.includes(i) ? 'used' : ''}`}
              onClick={() => !assembled.includes(i) && setSelPiece(i)}
            >
              {sym}
            </div>
          ))}
        </div>

        <div
          className="anim-fadeInUp stagger-2"
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4,
            width: 260, padding: 12,
            background: 'rgba(139,111,176,.15)', borderRadius: 12, border: '2px dashed var(--mist)',
          }}
        >
          {assembled.map((piece, i) => (
            <div
              key={i}
              style={{ height: 48, borderRadius: 6, border: '1px dashed rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', cursor: 'pointer', ...(piece !== null ? { background: 'rgba(139,111,176,.3)', borderStyle: 'solid' } : {}) }}
              onClick={() => handleSlot(i)}
            >
              {piece !== null ? PIECE_SYMBOLS[piece] : ''}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ─── COUNT PHASE ─── */
  return (
    <div className="puzzle-container">
      <div className="puzzle-instruction anim-fadeInUp">
        <p className="nikud">הַלּוּחַ הוּרְכַּב! כַּמָּה נְקוּדוֹת מוּפִיעוֹת עָלָיו?</p>
      </div>

      <div
        className="anim-fadeInUp stagger-1"
        style={{
          width: 120, height: 120, borderRadius: 16,
          background: 'rgba(139,111,176,.3)', border: '3px solid var(--mist)',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          placeItems: 'center', padding: 16, fontSize: '1.5rem',
        }}
      >
        <span>●</span><span></span><span>●</span>
        <span></span><span>●</span><span></span>
        <span>●</span><span></span><span>●</span>
      </div>

      <div className="count-input-area anim-fadeInUp stagger-2">
        <input className="count-input" type="number" min="0" max="20" value={countVal} onChange={(e) => setCountVal(e.target.value)} aria-label="מספר נקודות" />
        <button className="btn btn-primary btn-small" onClick={checkCount}>✓</button>
      </div>

      {feedback && <div className={`feedback-bubble ${feedback.ok ? 'feedback-success' : 'feedback-error'}`}>{feedback.text}</div>}
    </div>
  );
}
