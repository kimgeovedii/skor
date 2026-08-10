/**
 * Voice-over service using Web Speech API.
 * Uses voiceLines.js bank for variety — Gen Z style.
 */
import {
  normalPoint, streakLeading, streakTrailing, comebackPoint, bigLeadPoint,
  closeFightPoint, tauntLines, tiedLines, trailingPoint, closingInPoint,
  longDeucePoint, breakLines, breakPantun, pressPlayLines,
} from "./voiceLines";

// ── Language ──
let currentLang = "en";
export function setVoiceLanguage(lang) { currentLang = lang; }
export function getVoiceLanguage() { return currentLang; }

// ── Intro state ──
let introPlaying = false;
export function isIntroPlaying() { return introPlaying; }

// ── Score words ──
const SCORE_EN = [
  "zero","one","two","three","four","five","six","seven","eight","nine",
  "ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen",
  "seventeen","eighteen","nineteen","twenty","twenty-one","twenty-two",
  "twenty-three","twenty-four","twenty-five","twenty-six","twenty-seven",
  "twenty-eight","twenty-nine","thirty",
];
const SCORE_ID = [
  "nol","satu","dua","tiga","empat","lima","enam","tujuh","delapan","sembilan",
  "sepuluh","sebelas","dua belas","tiga belas","empat belas","lima belas","enam belas",
  "tujuh belas","delapan belas","sembilan belas","dua puluh","dua puluh satu","dua puluh dua",
  "dua puluh tiga","dua puluh empat","dua puluh lima","dua puluh enam","dua puluh tujuh",
  "dua puluh delapan","dua puluh sembilan","tiga puluh",
];
function sw(n) { return (currentLang === "id" ? SCORE_ID : SCORE_EN)[n] || String(n); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function scoreSuffix(tA, tB, sA, sB) { return `${tA} ${sw(sA)}, ${tB} ${sw(sB)}.`; }

// ── Speech engine ──
function speak(text, { rate = 1.0, pitch = 1.35, onEnd } = {}) {
  if (!("speechSynthesis" in window)) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = currentLang === "id" ? "id-ID" : "en-US";
  u.rate = rate; u.pitch = pitch; u.volume = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const lv = voices.filter((v) => v.lang.startsWith(currentLang === "id" ? "id" : "en"));
  if (currentLang === "en") {
    const fem = ["Zira","Hazel","Susan","Jenny","Aria","Female"];
    const male = lv.filter((v) => !fem.some((f) => v.name.includes(f)));
    const prefs = ["Microsoft David","Google US English","Microsoft Mark","Daniel","Alex"];
    let p = null;
    for (const n of prefs) { p = male.find((v) => v.name.includes(n)); if (p) break; }
    if (!p && male.length > 0) p = male[0];
    if (!p && lv.length > 0) p = lv[0];
    if (p) u.voice = p;
  } else {
    if (lv.length > 0) u.voice = lv[0];
  }
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  window.speechSynthesis.speak(u);
}

// ── Queue ──
let queue = [], isSpeaking = false, onQueueEmpty = null;
function processQueue() {
  if (isSpeaking || queue.length === 0) {
    if (!isSpeaking && queue.length === 0 && onQueueEmpty) {
      const cb = onQueueEmpty; onQueueEmpty = null; cb();
    }
    return;
  }
  isSpeaking = true;
  const { text, options } = queue.shift();
  speak(text, { ...options, onEnd: () => { isSpeaking = false; processQueue(); } });
}
function enqueue(text, options = {}) { queue.push({ text, options }); processQueue(); }

export function clearVoiceQueue() {
  queue = []; isSpeaking = false; onQueueEmpty = null; introPlaying = false;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}
export function onVoiceDone(callback) {
  onQueueEmpty = callback;
  if (!isSpeaking && queue.length === 0) { onQueueEmpty = null; callback(); }
}
export function isQueueBusy() { return isSpeaking || queue.length > 0; }

// ── Early point interrupt ──
const earlyPointLines = {
  id: [
    "Anjir belum apa apa udah masuk, santai dong bang!",
    "Yaa belum selesai ngomong udah masuk aja, sabar bang!",
    "Hadeh baru juga mau ngomong udah gol aja, oke lah!",
    "Eh udahan dong ngomongnya, udah ada yang skor nih!",
    "Wah buru buru banget! Belum selesai perkenalan udah main!",
  ],
  en: [
    "Whoa hold on! Already a point? We just started!",
    "Wait wait, we haven't finished talking! Okay then!",
    "Already scoring? Someone's eager! Let's go!",
    "Can't even finish the intro! A point already!",
    "Well that was fast! Point before we even started properly!",
  ],
};

// ══════════════════════════════════
// SMART CONDITION DETECTION
// ══════════════════════════════════

/**
 * SCORE-AWARE CONDITION DETECTION
 * 
 * Determines the "mood" of a point by looking at:
 * 1. WHO is actually leading/trailing (not just who scored)
 * 2. The size of the gap (big lead vs close fight)
 * 3. Streak context (dominating vs fighting back)
 * 4. Whether the gap is growing or shrinking
 */
function detectCondition(scorerTeam, _unused, scoreA, scoreB, streak, prevScoreA, prevScoreB) {
  // Calculate from scorer's perspective
  const scorerScore = scorerTeam === "a" ? scoreA : scoreB;
  const opponentScore = scorerTeam === "a" ? scoreB : scoreA;
  const gap = scorerScore - opponentScore; // positive = scorer leads, negative = scorer trails
  
  const prevScorerScore = scorerTeam === "a" ? prevScoreA : prevScoreB;
  const prevOpponentScore = scorerTeam === "a" ? prevScoreB : prevScoreA;
  const prevGap = prevScorerScore - prevOpponentScore;

  // ── LONG DEUCE (Capek/Ngantuk condition) ──
  // Jika sudah deuce (20-20) lalu ada yang cetak poin (21-20, 21-21, 22-21 dst)
  // Udah set point tapi gak kelar-kelar.
  if (scoreA >= 20 && scoreB >= 20 && (scoreA + scoreB >= 41)) return "longDeuce";

  // ── TIED ──
  if (scoreA === scoreB && scoreA > 0) return "tied";

  // ── STREAK (3+ consecutive) — context matters! ──
  if (streak >= 3) {
    if (gap > 0) return "streakLeading";   // streak AND winning → domination
    if (gap < 0) return "streakTrailing";  // streak but STILL behind → fighting back
    return "tied"; // streak brought them to tied
  }

  // ── COMEBACK: was behind 3+, now tied or took lead ──
  if (prevGap <= -3 && gap >= 0) return "comeback";

  // ── SCORER IS LEADING ──
  if (gap > 0) {
    if (gap >= 5) return "bigLead";  // big lead (5+) → domination
    if (scoreA >= 10 && scoreB >= 10 && gap <= 2) return "closeFight";  // high score, tight
    return "normal"; // just ahead
  }

  // ── SCORER IS TRAILING ──
  if (gap < 0) {
    const absGap = Math.abs(gap);
    if (absGap >= 4) return "trailing";     // far behind (4+) → "masih jauh bro"
    if (absGap <= 3 && absGap < Math.abs(prevGap)) return "closingIn";  // gap shrinking
    if (scoreA >= 10 && scoreB >= 10 && absGap <= 2) return "closeFight";  // high score, tight
    return "normal";
  }

  return "normal";
}

// ══════════════════════════════════
// PUBLIC FUNCTIONS
// ══════════════════════════════════

/** Full match intro */
export function announceIntro(teamA, teamB, matchType, onIntroDone) {
  introPlaying = true;
  const type = currentLang === "id"
    ? (matchType === "singles" ? "tunggal" : "ganda")
    : (matchType === "singles" ? "singles" : "doubles");
  const join = currentLang === "id" ? " dan " : " and ";
  const pA = teamA.players.join(join);
  const pB = teamB.players.join(join);

  if (currentLang === "id") {
    enqueue(`Pertandingan ${type} akan segera dimulai!`, { rate: 0.95, pitch: 1.3 });
    enqueue(`${teamA.name}, yang diwakili oleh ${pA}, melawan ${teamB.name}, yang diwakili oleh ${pB}.`, { rate: 0.95, pitch: 1.2 });
    enqueue(`Sebelum memulai, mari kita berdoa dulu menurut kepercayaan masing masing.`, { rate: 0.9, pitch: 1.1 });
    enqueue(`Berdoa dimulai.`, { rate: 0.85, pitch: 1.0 });
    enqueue(`...`, { rate: 0.3, pitch: 0.5 });
    enqueue(`Ayo kita cek ombak!`, { rate: 1.0, pitch: 1.4 });
    enqueue(`Suporter ${teamA.name} mana suaranyaa!`, { rate: 1.0, pitch: 1.4 });
    enqueue(`${teamB.name} jangan kalah, mana suaranyaaa!`, { rate: 1.0, pitch: 1.4 });
    enqueue(`Mantap! Kalau begitu siapkan dukungan terbaik untuk tim kalian. Selamat menonton, enjoy the game!`, { rate: 0.95, pitch: 1.3 });
  } else {
    enqueue(`The ${type} match is about to begin!`, { rate: 0.95, pitch: 1.3 });
    enqueue(`${teamA.name}, represented by ${pA}, versus ${teamB.name}, represented by ${pB}.`, { rate: 0.95, pitch: 1.2 });
    enqueue(`Before we start, let us have a moment of prayer.`, { rate: 0.9, pitch: 1.1 });
    enqueue(`...`, { rate: 0.3, pitch: 0.5 });
    enqueue(`Let's check the crowd!`, { rate: 1.0, pitch: 1.4 });
    enqueue(`${teamA.name} supporters, let's hear you!`, { rate: 1.0, pitch: 1.4 });
    enqueue(`${teamB.name}, don't be quiet, make some noise!`, { rate: 1.0, pitch: 1.4 });
    enqueue(`Awesome! Give your best support. Enjoy the game!`, { rate: 0.95, pitch: 1.3 });
  }

  onVoiceDone(() => { introPlaying = false; onIntroDone?.(); });
}

/** Early point during intro */
export function announceEarlyPoint() {
  clearVoiceQueue(); introPlaying = false;
  enqueue(pick(earlyPointLines[currentLang] || earlyPointLines.en), { rate: 1.0, pitch: 1.4 });
}

/**
 * Smart score announcement — picks the right tone based on ACTUAL game situation.
 */
export function announceScore(scorerName, opponentName, teamAName, teamBName, scoreA, scoreB, streak = 0, scorerTeam = "a", prevScoreA = 0, prevScoreB = 0) {
  const condition = detectCondition(scorerTeam, null, scoreA, scoreB, streak, prevScoreA, prevScoreB);
  const lang = currentLang;
  const suffix = ` ${scoreSuffix(teamAName, teamBName, scoreA, scoreB)}`;

  let line;
  switch (condition) {
    case "streakLeading":
      line = pick(streakLeading[lang] || streakLeading.en)(scorerName, opponentName);
      enqueue(line + suffix, { pitch: 1.5 });
      enqueue(pick(tauntLines[lang] || tauntLines.en)(opponentName), { pitch: 1.3 });
      return;

    case "streakTrailing":
      line = pick(streakTrailing[lang] || streakTrailing.en)(scorerName, opponentName);
      enqueue(line + suffix, { pitch: 1.3 });
      return;

    case "comeback":
      line = pick(comebackPoint[lang] || comebackPoint.en)(scorerName, opponentName);
      enqueue(line + suffix, { pitch: 1.4 });
      return;

    case "tied":
      line = pick(tiedLines[lang] || tiedLines.en)(scorerName);
      enqueue(line + ` ${sw(scoreA)} ${lang === "id" ? "sama" : "all"}!`, { pitch: 1.3 });
      return;

    case "bigLead":
      line = pick(bigLeadPoint[lang] || bigLeadPoint.en)(scorerName, opponentName);
      enqueue(line + suffix, { pitch: 1.2 });
      enqueue(pick(tauntLines[lang] || tauntLines.en)(opponentName), { pitch: 1.3 });
      return;

    case "trailing":
      line = pick(trailingPoint[lang] || trailingPoint.en)(scorerName, opponentName);
      enqueue(line + suffix, { pitch: 1.1 });
      return;

    case "closingIn":
      line = pick(closingInPoint[lang] || closingInPoint.en)(scorerName, opponentName);
      enqueue(line + suffix, { pitch: 1.35 });
      return;

    case "closeFight":
      line = pick(closeFightPoint[lang] || closeFightPoint.en)(scorerName, opponentName);
      enqueue(line + suffix, { pitch: 1.35 });
      return;

    case "longDeuce":
      line = pick(longDeucePoint[lang] || longDeucePoint.en)(scorerName, opponentName);
      enqueue(line + suffix, { pitch: 1.1, rate: 0.95 }); // a bit slower/exhausted
      return;

    default: // "normal"
      line = pick(normalPoint[lang] || normalPoint.en)(scorerName, opponentName);
      enqueue(line + suffix);
      if (Math.random() < 0.25) {
        enqueue(pick(tauntLines[lang] || tauntLines.en)(opponentName), { pitch: 1.3 });
      }
      return;
  }
}

export function announceScoreEqual(scorerName, opponentName, score, streak = 0) {
  const lang = currentLang;
  if (streak >= 3) {
    const line = pick(streakPoint[lang] || streakPoint.en)(scorerName, opponentName);
    enqueue(`${line} ${sw(score)} ${lang === "id" ? "sama" : "all"}!`, { pitch: 1.5 });
  } else {
    const line = pick(tiedLines[lang] || tiedLines.en)(scorerName);
    enqueue(`${line} ${sw(score)} ${lang === "id" ? "sama" : "all"}!`, { pitch: 1.3 });
  }
}

export function announceDeuce(scorerName) {
  const lang = currentLang;
  const text = lang === "id"
    ? `Poin untuk ${scorerName}! Jus! Seru banget pertandingan ini!`
    : `Point for ${scorerName}! Deuce! What a match!`;
  enqueue(text, { pitch: 1.4 });
}

export function announceSetPoint(teamName, teamAName, teamBName, scoreA, scoreB) {
  const lang = currentLang;
  const suffix = scoreSuffix(teamAName, teamBName, scoreA, scoreB);
  const text = lang === "id"
    ? `Set poin! ${teamName}! ${suffix}`
    : `Set point! ${teamName}! ${suffix}`;
  enqueue(text, { pitch: 1.3 });
}

export function announceMatchPoint(teamName, teamAName, teamBName, scoreA, scoreB) {
  const lang = currentLang;
  const suffix = scoreSuffix(teamAName, teamBName, scoreA, scoreB);
  const text = lang === "id"
    ? `Matc poin! ${teamName}! ${suffix}`
    : `Match point! ${teamName}! ${suffix}`;
  enqueue(text, { pitch: 1.4 });
}

export function announceInterval(teamAName, teamBName, scoreA, scoreB) {
  const lang = currentLang;
  const suffix = scoreSuffix(teamAName, teamBName, scoreA, scoreB);
  const text = lang === "id"
    ? `Interval! ${suffix} Pindah tempat!`
    : `Interval! ${suffix} Change ends please!`;
  enqueue(text, { pitch: 1.2 });
}

export function announceSetWon(teamName, setNumber, teamAName, teamBName, scoreA, scoreB) {
  const lang = currentLang;
  const suffix = scoreSuffix(teamAName, teamBName, scoreA, scoreB);
  const text = lang === "id"
    ? `Game! Set ${setNumber}, dimenangkan oleh ${teamName}! ${suffix}`
    : `Game! Set ${setNumber}, won by ${teamName}! ${suffix}`;
  enqueue(text, { pitch: 1.2 });
}

export function announceMatchWon(teamName, playerNames) {
  const lang = currentLang;
  const join = lang === "id" ? " dan " : " and ";
  const text = lang === "id"
    ? `Pertandingan dimenangkan oleh ${teamName}! Selamat kepada ${playerNames.join(join)}!`
    : `Match won by ${teamName}! Congratulations to ${playerNames.join(join)}!`;
  enqueue(text, { rate: 0.95, pitch: 1.4 });
}

export function announceCelebration() {
  const text = currentLang === "id"
    ? "Untuk merayakan, kita joget dulu!"
    : "Let's celebrate! Time to dance!";
  enqueue(text, { rate: 1.0, pitch: 1.4 });
}

export function announceRevision() {
  const text = currentLang === "id"
    ? "Maaf, revisi skor gaes, hehe."
    : "Score revision, sorry about that!";
  enqueue(text, { rate: 1.0, pitch: 1.1 });
}

/** Random break voice-over line (crowd engagement + pantun) */
export function announceBreakLine(teamAName, teamBName) {
  const lang = currentLang;
  // 60% crowd engagement, 40% pantun
  if (Math.random() < 0.6) {
    const line = pick(breakLines[lang] || breakLines.en)(teamAName, teamBName);
    enqueue(line, { rate: 1.0, pitch: 1.35 });
  } else {
    const pantun = pick(breakPantun[lang] || breakPantun.en);
    enqueue(pantun, { rate: 0.95, pitch: 1.2 });
  }
}

/** Warning when user tries to score before pressing play */
export function announcePressPlay() {
  const lang = currentLang;
  const line = pick(pressPlayLines[lang] || pressPlayLines.en);
  enqueue(line, { rate: 1.0, pitch: 1.3 });
}

export function initVoices() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
}
