import { useState, useCallback } from 'react';
import { useGame, ACTIONS } from '../../context/GameContext';
import { ROOMS, CIPHER_TABLE, CIPHER_ENCRYPTED, CIPHER_ANSWER } from '../../constants';
import HintSystem from '../shared/HintSystem';
import SuccessOverlay from '../shared/SuccessOverlay';

/**
 * Cipher Puzzle — Decode an encrypted word using a substitution table.
 * Encrypted: בשגפ → Decoded: ארבע → Digit: 4
 */
export default function CipherPuzzle() {
  const { state, dispatch } = useGame();
  const room = ROOMS.comms;
  const isSolved = state.roomStatus.comms.solved;

  const [answer, setAnswer] = useState('');
  const [shaking, setShaking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassiveHint, setShowPassiveHint] = useState(false);

  // Display cipher table entries (subset for visual clarity)
  const displayPairs = [
    { enc: 'ב', dec: 'א' },
    { enc: 'ג', dec: 'ב' },
    { enc: 'ד', dec: 'ג' },
    { enc: 'ה', dec: 'ד' },
    { enc: 'ו', dec: 'ה' },
    { enc: 'ז', dec: 'ו' },
    { enc: 'ח', dec: 'ז' },
    { enc: 'ט', dec: 'ח' },
    { enc: 'כ', dec: 'י' },
    { enc: 'ל', dec: 'כ' },
    { enc: 'מ', dec: 'ל' },
    { enc: 'נ', dec: 'מ' },
    { enc: 'ס', dec: 'נ' },
    { enc: 'פ', dec: 'ע' },
    { enc: 'ש', dec: 'ר' },
    { enc: 'ת', dec: 'ש' },
  ];

  // Highlight letters used in the encrypted word
  const encryptedLetters = new Set(CIPHER_ENCRYPTED.split(''));

  const normalizeHebrew = (str) => {
    return str.replace(/[\u0591-\u05C7]/g, '').replace(/\s/g, '').replace(/[ךםןףץ]/g, (c) => {
      const map = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
      return map[c] || c;
    });
  };

  const handleSubmit = useCallback(() => {
    const normalized = normalizeHebrew(answer);
    const target = normalizeHebrew(CIPHER_ANSWER);

    if (normalized === target) {
      setShowSuccess(true);
      dispatch({
        type: ACTIONS.SOLVE_ROOM,
        payload: { roomId: 'comms', digit: room.digit, digitIndex: room.digitIndex },
      });
    } else {
      setShaking(true);
      dispatch({ type: ACTIONS.INCREMENT_ATTEMPT, payload: 'comms' });
      setTimeout(() => setShaking(false), 500);
    }
  }, [answer, dispatch, room]);

  const handleContinue = () => {
    dispatch({ type: ACTIONS.LEAVE_ROOM });
  };

  if (showSuccess) {
    return <SuccessOverlay digit={room.digit} digitIndex={room.digitIndex} onContinue={handleContinue} />;
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Story */}
      <p className="text-game-base font-body text-ui-text mb-6 animate-slide-up text-center">
        הִתְקַבְּלָה הוֹדָעָה מֻצְפֶּנֶת מִתַּחֲנָה אַחֶרֶת! פַּעֲנְחוּ אוֹתָהּ כְּדֵי לִמְצוֹא אֶת הַסִּפְרָה.
      </p>

      {/* Space computer frame */}
      <div className="relative rounded-2xl border border-accent-purple/40 bg-space-mid/60 p-5 md:p-6 mb-6 glow-border-purple animate-fade-in">
        {/* LED indicators */}
        <div className="flex gap-2 mb-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-accent-purple animate-breathe"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </div>

        {/* Encrypted message */}
        <div className="text-center mb-4">
          <p className="text-game-sm text-ui-dim font-body mb-2">הוֹדָעָה מֻצְפֶּנֶת:</p>
          <div className="flex justify-center gap-3" dir="rtl">
            {CIPHER_ENCRYPTED.split('').map((letter, i) => (
              <div
                key={i}
                className="w-14 h-16 rounded-xl border-2 border-accent-purple bg-accent-purple/10 flex items-center justify-center text-game-xl font-display font-bold text-accent-purple animate-slide-up"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>

        {/* Antenna hint (passive) */}
        <button
          onClick={() => setShowPassiveHint(true)}
          className="absolute top-3 left-3 text-2xl animate-breathe clickable-area"
          aria-label="רֶמֶז מֵהָאַנְטֶנָה"
          style={{ animationDelay: '2s' }}
        >
          📡
        </button>
      </div>

      {/* Cipher table */}
      <div className="mb-6 animate-slide-up stagger-2">
        <p className="text-game-sm text-accent-cyan font-display font-bold text-center mb-3">
          🔑 טַבְלַת פֵּעַנוּחַ:
        </p>
        <div className="bg-space-light/40 rounded-xl p-4 overflow-x-auto">
          <div className="flex gap-2 justify-center flex-wrap">
            {displayPairs.map(({ enc, dec }, i) => {
              const isUsed = encryptedLetters.has(enc);
              return (
                <div
                  key={i}
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded-lg min-w-[44px]
                    ${isUsed ? 'bg-accent-purple/20 border border-accent-purple/40' : 'bg-space-deep/30'}
                  `}
                >
                  <span className={`text-sm font-bold ${isUsed ? 'text-accent-purple' : 'text-ui-dim'}`}>
                    {enc}
                  </span>
                  <span className="text-accent-cyan text-xs">↓</span>
                  <span className="text-sm font-bold text-ui-text">
                    {dec}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-sm text-ui-dim text-center mt-2 font-body">
          כָּל אוֹת מֻחְלֶפֶת בָּאוֹת שֶׁלִּפְנֵיהָ בְּאָלֶף-בֵּית
        </p>
      </div>

      {/* Answer input */}
      <div className={`text-center animate-slide-up stagger-3 ${shaking ? 'animate-shake' : ''}`}>
        <p className="text-game-base font-display font-bold text-accent-orange mb-3">
          מָה הַמִּלָּה הַמְפוּעֶנַחַת?
        </p>

        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="כִּתְבוּ אֶת הַמִּלָּה..."
          className="w-full max-w-xs mx-auto h-14 rounded-xl bg-space-light border-2 border-accent-purple/30 text-center text-game-lg font-display font-bold text-accent-purple px-4 focus:border-accent-purple focus:outline-none placeholder:text-ui-dim/40 placeholder:text-base"
          dir="rtl"
          aria-label="הַמִּלָּה הַמְפוּעֶנַחַת"
        />

        <button
          onClick={handleSubmit}
          disabled={!answer.trim()}
          className={`
            mt-4 px-8 py-3 rounded-xl font-display font-bold text-game-base block mx-auto
            transition-all duration-300 clickable-area focus-ring
            ${answer.trim()
              ? 'bg-accent-orange text-space-deep hover:shadow-[0_0_20px_rgba(255,138,92,0.6)]'
              : 'bg-ui-dim/30 text-ui-dim cursor-not-allowed'
            }
          `}
        >
          פַּעֲנֵחַ! 🛰️
        </button>

        {shaking && (
          <p className="mt-3 text-ui-danger text-game-sm font-body animate-fade-in">
            לֹא מְדוּיָק... נַסּוּ שׁוּב עִם הַטַּבְלָה! 🔑
          </p>
        )}
      </div>

      {/* Passive hint */}
      {showPassiveHint && (
        <div className="fixed bottom-24 right-4 left-4 md:left-auto md:right-8 md:max-w-sm z-40 animate-bounce-in">
          <div className="bg-space-light/95 backdrop-blur-sm border border-accent-purple/30 rounded-2xl p-4 text-game-sm text-ui-text shadow-lg">
            <button onClick={() => setShowPassiveHint(false)} className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center text-ui-dim hover:text-ui-text">✕</button>
            <p className="font-body">📡 לְמָשָׁל: אִם כָּתוּב <span className="text-accent-purple font-bold">ב</span>, הַכַּוָּנָה הִיא <span className="text-accent-cyan font-bold">א</span>!</p>
          </div>
        </div>
      )}

      <HintSystem
        passiveHint="📡 כָּל אוֹת הוֹפֶכֶת לָאוֹת שֶׁלִּפְנֵיהָ: ב→א, ג→ב..."
        activeHint="תִּסְתַּכְּלוּ עַל כָּל אוֹת בַּהוֹדָעָה, וּמִצְאוּ אוֹתָהּ בַּטַּבְלָה. הָאוֹת שֶׁלְּמַטָּה הִיא הַתַּשׁוּבָה! הַמִּלָּה הִיא מִסְפָּר..."
      />
    </div>
  );
}
