# 🚀 המשימה לתחנת החלל — כוכב-7

חדר בריחה דיגיטלי בעברית לילדים. הצילו את תחנת החלל כוכב-7 על ידי פתרון 4 חידות ואיסוף קוד סודי בן 4 ספרות!

## 🎮 על המשחק

- **גיל יעד:** 7+
- **זמן משחק:** 25 דקות
- **שפה:** עברית עם ניקוד מלא
- **נושא:** חלל, כוכבים, אסטרונאוטים

### 4 חדרי חידות:
1. 🔭 **תא התצפית** — חידת ספירת כוכבים
2. 🛰️ **תא התקשורת** — כתב סתרים (צופן פענוח)
3. 🪐 **תא המעבדה** — חידת הבדלים (מצאו 4 הבדלים)
4. ⭐ **תא הניווט** — מבוך אסטרואידים

## 🛠️ טכנולוגיות

- **React 18** — JSX + Hooks
- **Tailwind CSS 3.4** — Utility-first styling
- **Vite 5** — Build tool
- **PWA** — Progressive Web App עם Service Worker

## 📦 התקנה והרצה

```bash
# התקנת dependencies
npm install

# הרצה בסביבת פיתוח
npm run dev

# בנייה לפרודקשן
npm run build

# צפייה בבילד
npm run preview
```

## 📁 מבנה הפרויקט

```
space-escape-room/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service Worker
├── src/
│   ├── components/
│   │   ├── puzzles/
│   │   │   ├── CountingPuzzle.jsx    # 🔭 חידת ספירה
│   │   │   ├── CipherPuzzle.jsx      # 🛰️ כתב סתרים
│   │   │   ├── DifferencesPuzzle.jsx # 🪐 חידת הבדלים
│   │   │   └── MazePuzzle.jsx        # ⭐ מבוך
│   │   ├── screens/
│   │   │   ├── SplashScreen.jsx      # מסך פתיחה
│   │   │   ├── BriefingScreen.jsx    # תדרוך משימה
│   │   │   ├── MapScreen.jsx         # מפת התחנה
│   │   │   ├── RoomScreen.jsx        # עטיפת חדר
│   │   │   ├── CodeEntryScreen.jsx   # הזנת קוד
│   │   │   ├── VictoryScreen.jsx     # מסך ניצחון
│   │   │   └── TimeUpScreen.jsx      # נגמר הזמן
│   │   └── shared/
│   │       ├── StarBackground.jsx    # רקע כוכבים
│   │       ├── GlowButton.jsx        # כפתור זוהר
│   │       ├── Confetti.jsx          # אנימציית קונפטי
│   │       ├── SandTimer.jsx         # שעון חול
│   │       ├── HintSystem.jsx        # מערכת רמזים
│   │       └── SuccessOverlay.jsx    # שכבת הצלחה
│   ├── context/
│   │   └── GameContext.jsx           # State מרכזי + Reducer
│   ├── hooks/
│   │   ├── useTimer.js               # ניהול טיימר
│   │   └── useInactivity.js          # זיהוי חוסר פעילות
│   ├── styles/
│   │   └── globals.css               # Tailwind + CSS מותאם
│   ├── constants.js                  # קבועי משחק
│   ├── App.jsx                       # רכיב ראשי
│   └── main.jsx                      # נקודת כניסה
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 עיצוב

- **פלטת צבעים:** כחול-חלל עמוק עם הדגשות בטורקיז, סגול וכתום
- **פונטים:** Rubik (כותרות), Heebo (טקסט)
- **אנימציות:** כוכבים מהבהבים, glow pulse, fade-in, shake, confetti
- **RTL:** תמיכה מלאה בכיוון ימין-לשמאל
- **נגישות:** ניגודיות גבוהה, אזורי לחיצה 44px, aria-labels, reduced-motion

## 🎯 הקוד הסודי

הקוד הסופי הוא **6-4-8-9** (ספרה אחת מכל חדר, לפי סדר החדרים).

## 📱 PWA

המשחק תומך בהתקנה כ-Progressive Web App:
- עובד אופליין (עם Service Worker)
- ניתן להתקנה על מסך הבית
- display: standalone ללא UI של דפדפן

## 📝 רישיון

פרויקט אישי / חינוכי.
