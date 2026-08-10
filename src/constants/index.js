// ── Storage ──
export const STORAGE_KEY = "skor-turnamen-badminton-v2";
export const PHOTOS_KEY = "skor-turnamen-photos";

// ── Audio ──
export const SOUND_POINT = "/audio/chappelle-ah.mp3";
export const SOUND_UNDO = "/audio/fahhhhhhhhhhhhhh.mp3";

// ── Break Music (loop during set breaks) ──
export const BREAK_TRACKS = [
  "/audio/break1.mp3",
  "/audio/break2.mp3",
  "/audio/break3.mp3",
  "/audio/break4.mp3",
  "/audio/break5.mp3",
];

// ── Images ──
export const PHOTO_MAX_SIZE = 400;
export const DEFAULT_AVATAR = "/default-athlete.png";

// ── Badminton Rules ──
export const SET_TARGET = 21;
export const MAX_SCORE = 30;
export const DEUCE_MARGIN = 2;
export const TOTAL_SETS = 3;
export const SETS_TO_WIN = 2;
export const INTERVAL_SCORE = 11;

// ── Match Types ──
export const MATCH_TYPES = {
  SINGLES: "singles",
  DOUBLES: "doubles",
};

// ── Initial Match State ──
export const createInitialMatch = () => ({
  teamA: { name: "", players: [] },
  teamB: { name: "", players: [] },
  matchType: MATCH_TYPES.DOUBLES,
  currentSet: 0,
  sets: [
    { scoreA: 0, scoreB: 0, winner: null },
    { scoreA: 0, scoreB: 0, winner: null },
    { scoreA: 0, scoreB: 0, winner: null },
  ],
  setsWon: { a: 0, b: 0 },
  matchWinner: null,
  isStarted: false,
  setReady: false, // false = waiting for Play button
  startTime: null,
  elapsedBeforePause: 0, // accumulated seconds before current set
  server: "a",
  history: [],
});
