// ============================================================
// Game Configuration Constants
// ============================================================

export const TOTAL_TIME_SECONDS = 25 * 60; // 25 minutes

export const ROOMS = {
  telescope: {
    id: 'telescope',
    name: 'תָּא הַתַּצְפִּית',
    icon: '🔭',
    digitIndex: 0,
    digit: 6,
  },
  comms: {
    id: 'comms',
    name: 'תָּא הַתִּקְשׁוֹרֶת',
    icon: '🛰️',
    digitIndex: 1,
    digit: 4,
  },
  lab: {
    id: 'lab',
    name: 'תָּא הַמַּעְבָּדָה',
    icon: '🪐',
    digitIndex: 2,
    digit: 8,
  },
  navigation: {
    id: 'navigation',
    name: 'תָּא הַנַּוִּוּט',
    icon: '⭐',
    digitIndex: 3,
    digit: 9,
  },
};

export const ROOM_ORDER = ['telescope', 'comms', 'lab', 'navigation'];

export const FINAL_CODE = [6, 4, 8, 9];

// Hint system timing (milliseconds)
export const PASSIVE_HINT_DELAY = 0;        // Available immediately but hidden
export const ACTIVE_HINT_DELAY = 90 * 1000; // 90 seconds of inactivity

// Colors for star counting puzzle
export const STAR_COLORS = {
  orange: { hex: '#FF8A5C', name: 'כְּתוּמִים', count: 6 },
  purple: { hex: '#A78BFA', name: 'סְגוּלִים', count: 5 },
  cyan:   { hex: '#4EEADD', name: 'טוּרְקִיזִים', count: 7 },
};

// Cipher puzzle: each letter shifts to next letter in alphabet
// Encrypted: בשגפר → Decrypted: ארבעד → "ארבע"
// Using simpler mapping for kids: each encrypted letter = next letter
export const CIPHER_TABLE = {
  'ב': 'א',
  'ג': 'ב',
  'ד': 'ג',
  'ה': 'ד',
  'ו': 'ה',
  'ז': 'ו',
  'ח': 'ז',
  'ט': 'ח',
  'י': 'ט',
  'כ': 'י',
  'ל': 'כ',
  'מ': 'ל',
  'נ': 'מ',
  'ס': 'נ',
  'ע': 'ס',
  'פ': 'ע',
  'צ': 'פ',
  'ק': 'צ',
  'ר': 'ק',
  'ש': 'ר',
  'ת': 'ש',
};

// Encrypted word: ב→א, ש→ר, ג→ב, פ→ע = "ארבע"
export const CIPHER_ENCRYPTED = 'בשגפ';
export const CIPHER_ANSWER = 'ארבע';

// Maze grid for navigation puzzle (7x7)
// 0 = path, 1 = asteroid, 2 = star, 3 = start, 4 = end
export const MAZE_GRID = [
  [3, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [0, 0, 2, 0, 1, 0, 0],
  [0, 1, 1, 0, 0, 0, 1],
  [0, 0, 0, 1, 0, 1, 0],
  [1, 1, 2, 0, 0, 2, 0],
  [1, 0, 0, 1, 0, 0, 4],
];

export const MAZE_STARS = [
  { x: 2, y: 2, value: 2 },
  { x: 2, y: 5, value: 3 },
  { x: 5, y: 5, value: 4 },
];

export const MAZE_START = { x: 0, y: 0 };
export const MAZE_END = { x: 6, y: 6 };
export const MAZE_SUM = 9; // 2+3+4
