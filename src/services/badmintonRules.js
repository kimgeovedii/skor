import { SET_TARGET, MAX_SCORE, DEUCE_MARGIN, SETS_TO_WIN, INTERVAL_SCORE } from "@/constants";

/**
 * Pure logic functions for badminton scoring rules.
 * No side effects — suitable for unit testing.
 */

/** Check if a set is won (target 21, deuce rule, max 30) */
export function isSetWon(scoreA, scoreB) {
  const max = Math.max(scoreA, scoreB);
  const min = Math.min(scoreA, scoreB);

  // Max 30: at 29-29 first to 30 wins
  if (max >= MAX_SCORE) return true;

  // Normal: reach target with 2-point margin
  if (max >= SET_TARGET && (max - min) >= DEUCE_MARGIN) return true;

  return false;
}

/** Get the winner of a set ("a" | "b" | null) */
export function getSetWinner(scoreA, scoreB) {
  if (!isSetWon(scoreA, scoreB)) return null;
  return scoreA > scoreB ? "a" : "b";
}

/** Check if the match is won (best of 3) */
export function isMatchWon(setsWonA, setsWonB) {
  return setsWonA >= SETS_TO_WIN || setsWonB >= SETS_TO_WIN;
}

/** Check deuce (both at or above target - 1, i.e. 20-20+) */
export function isDeuce(scoreA, scoreB) {
  return scoreA >= SET_TARGET - 1 && scoreB >= SET_TARGET - 1 && scoreA === scoreB;
}

/** Check if it's set point for either team */
export function getSetPointTeam(scoreA, scoreB) {
  if (isSetWon(scoreA, scoreB)) return null;

  // Normal set point: one point away from target with enough margin
  if (scoreA >= SET_TARGET - 1 && scoreA > scoreB) {
    if (scoreA - scoreB >= DEUCE_MARGIN - 1) return "a";
  }
  if (scoreB >= SET_TARGET - 1 && scoreB > scoreA) {
    if (scoreB - scoreA >= DEUCE_MARGIN - 1) return "b";
  }

  // At 29: always set point for the leader
  if (scoreA === MAX_SCORE - 1 && scoreA > scoreB) return "a";
  if (scoreB === MAX_SCORE - 1 && scoreB > scoreA) return "b";

  return null;
}

/** Check if it's match point for either team (set point when 1 set away from winning) */
export function getMatchPointTeam(scoreA, scoreB, setsWonA, setsWonB) {
  const setPointTeam = getSetPointTeam(scoreA, scoreB);
  if (!setPointTeam) return null;

  // It's match point if the team with set point is 1 set away from winning
  if (setPointTeam === "a" && setsWonA === SETS_TO_WIN - 1) return "a";
  if (setPointTeam === "b" && setsWonB === SETS_TO_WIN - 1) return "b";

  return null;
}

/** Check if interval should be called (first to 11, ONLY in set 3) */
export function isInterval(scoreA, scoreB, currentSet) {
  if (currentSet !== 2) return false; // Only set 3 (index 2)
  return (scoreA === INTERVAL_SCORE && scoreB < INTERVAL_SCORE) ||
         (scoreB === INTERVAL_SCORE && scoreA < INTERVAL_SCORE);
}

/** Check if players should change ends (after each set, and at 11 in set 3) */
export function shouldChangeEnds(currentSet, scoreA, scoreB) {
  if (currentSet === 2) {
    // In 3rd set, change at 11
    return isInterval(scoreA, scoreB);
  }
  return false;
}

/** Determine server after a point (in badminton, the team that wins the rally serves) */
export function getNextServer(scoringTeam) {
  return scoringTeam;
}

/** Check if set just ended and get result info */
export function analyzePoint(scoreA, scoreB, setsWonA, setsWonB, currentSet = 0) {
  const result = {
    setWon: isSetWon(scoreA, scoreB),
    setWinner: getSetWinner(scoreA, scoreB),
    matchWon: false,
    matchWinner: null,
    isDeuce: isDeuce(scoreA, scoreB),
    setPointTeam: getSetPointTeam(scoreA, scoreB),
    matchPointTeam: getMatchPointTeam(scoreA, scoreB, setsWonA, setsWonB),
    isInterval: isInterval(scoreA, scoreB, currentSet),
  };

  if (result.setWon && result.setWinner) {
    const newSetsA = setsWonA + (result.setWinner === "a" ? 1 : 0);
    const newSetsB = setsWonB + (result.setWinner === "b" ? 1 : 0);
    result.matchWon = isMatchWon(newSetsA, newSetsB);
    result.matchWinner = result.matchWon ? result.setWinner : null;
  }

  return result;
}
