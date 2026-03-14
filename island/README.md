# 🏝️ האי המסתורי — חדר בריחה דיגיטלי

חדר בריחה דיגיטלי בעברית לילדים בני 7, בנושא אי מסתורי.

## התקנה והרצה

```bash
npm install
npm start
```

האפליקציה תיפתח ב-`http://localhost:3000`.

## בנייה לפרודקשן

```bash
npm run build
```

התוצר ייווצר בתיקיית `build/` — ניתן לפרוס על כל שרת סטטי.

## PWA

האפליקציה כוללת:
- `manifest.json` — שם בעברית, RTL, אייקונים, standalone display
- `sw.js` — Service Worker עם cache-first לנכסים סטטיים ו-network-first ל-HTML
- אייקונים ב-192×192 ו-512×512
- `apple-mobile-web-app-capable` meta tag

## מבנה קבצים

```
public/
  index.html          ← HTML עם meta tags ל-PWA
  manifest.json       ← PWA manifest
  sw.js               ← Service Worker
  icons/
    icon-192.png
    icon-512.png

src/
  index.js            ← Entry point + SW registration
  App.js              ← Screen router

  data/
    gameData.js        ← קבועים: אזורים, רמזים, מיקומים
    gameReducer.js     ← State מרכזי + reducer

  hooks/
    useGameTimer.js    ← Custom hook לטיימר

  styles/
    index.css          ← כל ה-CSS: משתנים, אנימציות, רכיבים

  components/
    shared/
      index.js         ← Barrel export
      Confetti.js      ← אנימציית קונפטי
      LeavesBg.js      ← עלים ברקע
      Waves.js         ← גלים SVG
      GameHeader.js    ← כותרת עליונה + טיימר
      HintSystem.js    ← מערכת רמזים (פאסיבי + אקטיבי)

    screens/
      index.js         ← Barrel export
      SplashScreen.js  ← מסך פתיחה
      BriefingScreen.js← תדרוך
      MapScreen.js     ← מפת האי (Hub)
      ZoneScreen.js    ← Wrapper לאזור + רמזים
      CodeEntryScreen.js ← הזנת קוד
      VictoryScreen.js ← מסך ניצחון

    puzzles/
      JunglePuzzle.js  ← 🌴 חידת מסלול מקודד
      ParrotPuzzle.js  ← 🦜 חידת דפוס + ספירה
      WaterfallPuzzle.js← 🌊 חידת צינורות
      CavePuzzle.js    ← 🦇 ציד בחושך + הרכבה
      BeachPuzzle.js   ← 🗺️ פענוח מפה + חשבון
```

## 5 החידות

| # | אזור | סוג חידה | ספרה |
|---|-------|----------|------|
| 1 | 🌴 ג'ונגל | מסלול מקודד בסמלים + השלמת סמלים חסרים | 3 |
| 2 | 🦜 תוכים | זיהוי דפוס צבעים + ספירה ממוקדת | 5 |
| 3 | 🌊 מפל | חיבור צינורות + סיבוב | 7 |
| 4 | 🦇 מערה | ציד חפצים בחושך + הרכבת פאזל + ספירת נקודות | 5 |
| 5 | 🗺️ חוף | פענוח מפה לוגי + חידת חשבון | 4 |

**קוד סופי: 3 - 5 - 7 - 5 - 4**
