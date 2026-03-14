/* Zone definitions */
export const ZONE_DATA = {
  jungle:    { emoji: '🌴', name: 'הַגְ׳וּנְגֶל הַצָּפוּף',   digit: 3, bg: 'bg-jungle' },
  parrots:   { emoji: '🦜', name: 'עֵץ הַתּוֹכִּים',          digit: 5, bg: 'bg-jungle' },
  waterfall: { emoji: '🌊', name: 'מַפַּל הַמַּיִם',          digit: 7, bg: 'bg-waterfall' },
  cave:      { emoji: '🦇', name: 'הַמְּעָרָה הַחֲשׁוּכָה',    digit: 5, bg: 'bg-cave' },
  beach:     { emoji: '🗺️', name: 'חוֹף הַמַּפָּה',            digit: 4, bg: 'bg-beach' },
};

export const ZONE_ORDER = ['jungle', 'parrots', 'waterfall', 'cave', 'beach'];

export const TOTAL_TIME_SECONDS = 30 * 60;

/* Positions of zones on the island map (% from top-left) */
export const ZONE_POSITIONS = [
  { top: '8%',  right: '52%' },
  { top: '26%', right: '8%'  },
  { top: '48%', right: '55%' },
  { top: '56%', right: '12%' },
  { top: '78%', right: '32%' },
];

/* Hints for each zone */
export const ZONE_HINTS = {
  jungle: {
    passiveEmoji: '🦋',
    passiveText:  'טִיפ: עִקְבוּ אַחֲרֵי הַסְּמָלִים עִם הָאֶצְבַּע עַל הַמָּסָך!',
    activeText:   'אַחֲרֵי שְׁנֵי 🟢 בְּדֶרֶךְ כְּלָל בָּא 🔴!',
  },
  parrots: {
    passiveEmoji: '🐒',
    passiveText:  'הִסְתַּכְּלוּ עַל הָעֵנָף הָרִאשׁוֹן — הַדֶּפֶס חוֹזֵר עַל עַצְמוֹ!',
    activeText:   'הַצְּבָעִים חוֹזְרִים בִּקְבוּצוֹת. בָּעֵנָף הָרְבִיעִי הַקְּבוּצָה בַּת 4 צְבָעִים.',
  },
  waterfall: {
    passiveEmoji: '🦀',
    passiveText:  'הַמַּיִם זוֹרְמִים מִלְמַעְלָה לְמַטָּה. תַּתְחִילוּ מִשָּׁם!',
    activeText:   'לִחְצוּ עַל צִנּוֹר שֶׁכְּבָר מוּנָח כְּדֵי לְסוֹבֵב אוֹתוֹ!',
  },
  cave: {
    passiveEmoji: '💧',
    passiveText:  'הַשְּׁבָרִים מֻסְתָּרִים בַּפִּנּוֹת! הָזִיזוּ אֶת הַלַּפִּיד לְאַט.',
    activeText:   'חַפְּשׂוּ לְיַד הַסְּלָעִים בְּכָל אַרְבַּע הַפִּנּוֹת!',
  },
  beach: {
    passiveEmoji: '🍾',
    passiveText:  'קִרְאוּ אֶת כָּל הָרְמָזִים וְתִמְחֲקוּ מַה שֶׁלֹּא מַתְאִים!',
    activeText:   'הָרֶמֶז הָרִאשׁוֹן אוֹמֵר לָכֶם אֵיפֹה הָאוֹצָר לֹא נִמְצָא. תַּתְחִילוּ מִשָּׁם!',
  },
};
