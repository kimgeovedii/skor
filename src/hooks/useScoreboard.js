import { useState, useCallback, useEffect, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useAudio } from "./useAudio";
import { STORAGE_KEY, PHOTOS_KEY, createInitialMatch, TOTAL_SETS } from "@/constants";
import { analyzePoint, getNextServer } from "@/services/badmintonRules";
import * as voice from "@/services/voiceService";

/**
 * Central match state management hook.
 * Handles badminton scoring with sets, voice-over, break music, and animations.
 */
export function useScoreboard() {
  const [match, setMatch] = useLocalStorage(STORAGE_KEY, createInitialMatch());
  const [photos, setPhotos] = useLocalStorage(PHOTOS_KEY, {});
  const [animatingTeam, setAnimatingTeam] = useState(null);
  const [bumper, setBumper] = useState(null);
  const { 
    playDana, playRevisi, playCelebrate, 
    startBreakMusic, stopBreakMusic,
    duckBreakMusic, unduckBreakMusic 
  } = useAudio();
  const breakVoiceTimerRef = useRef(null);

  // Init voices and callbacks on mount
  useEffect(() => {
    voice.initVoices();
    voice.setGlobalVoiceCallbacks(duckBreakMusic, unduckBreakMusic);
  }, [duckBreakMusic, unduckBreakMusic]);

  const triggerAnimation = useCallback((team) => {
    setAnimatingTeam(team);
    setTimeout(() => setAnimatingTeam(null), 600);
  }, []);

  const triggerBumper = useCallback((team, teamName, teamPhotos) => {
    const photo = teamPhotos?.[0] || null;
    setBumper({ team, teamName, photo });
    setTimeout(() => setBumper(null), 2500);
  }, []);

  // ── Get team info helpers ──
  const getTeamName = useCallback((team) => {
    return team === "a" ? match.teamA.name : match.teamB.name;
  }, [match.teamA.name, match.teamB.name]);

  const getTeamPlayers = useCallback((team) => {
    return team === "a" ? match.teamA.players : match.teamB.players;
  }, [match.teamA.players, match.teamB.players]);

  const getTeamPhotos = useCallback((team) => {
    return team === "a" ? (photos.teamA || []) : (photos.teamB || []);
  }, [photos]);

  // ── Add Point ──
  const addPoint = useCallback(
    (team) => {
      if (match.matchWinner) return;

      // Block if set not ready (waiting for Play button)
      if (!match.setReady) {
        voice.announcePressPlay();
        return;
      }

      const currentSet = match.sets[match.currentSet];
      if (!currentSet) return;

      // Calculate new scores
      const newScoreA = team === "a" ? currentSet.scoreA + 1 : currentSet.scoreA;
      const newScoreB = team === "b" ? currentSet.scoreB + 1 : currentSet.scoreB;

      // Analyze the point
      const analysis = analyzePoint(newScoreA, newScoreB, match.setsWon.a, match.setsWon.b, match.currentSet);
      const scoringTeamName = getTeamName(team);

      // Save history for undo
      const historyEntry = {
        set: match.currentSet,
        scoreA: currentSet.scoreA,
        scoreB: currentSet.scoreB,
        server: match.server,
        setsWon: { ...match.setsWon },
      };

      // Play dana.mp3 IMMEDIATELY (before voice-over)
      playDana();
      triggerAnimation(team);
      triggerBumper(team, scoringTeamName, getTeamPhotos(team));

      // If intro is still playing, interrupt with "anjir belum apa-apa"
      if (voice.isIntroPlaying()) {
        voice.announceEarlyPoint();
        // Also start timer now since match has effectively begun
        setMatch((prev) => ({
          ...prev,
          startTime: prev.startTime || Date.now(),
        }));
      }

      // Calculate streak (consecutive points by same team)
      let streak = 1;
      const history = match.history;
      if (history.length > 0) {
        // Check who scored previously by comparing score diffs
        for (let i = history.length - 1; i >= 0; i--) {
          const h = history[i];
          const prevSet = match.sets[h.set];
          if (!prevSet || h.set !== match.currentSet) break;
          // Who scored at this history step? Compare with next state
          const nextH = i < history.length - 1 ? history[i + 1] : { scoreA: currentSet.scoreA, scoreB: currentSet.scoreB };
          const scoredA = (nextH.set === h.set) ? nextH.scoreA > h.scoreA : false;
          const lastScorer = scoredA ? "a" : "b";
          if (lastScorer === team) {
            streak++;
          } else {
            break;
          }
        }
      }

      const teamAName = match.teamA.name;
      const teamBName = match.teamB.name;
      const opponentName = team === "a" ? teamBName : teamAName;

      if (analysis.matchWon) {
        const winnerName = getTeamName(analysis.matchWinner);
        const winnerPlayers = getTeamPlayers(analysis.matchWinner);
        voice.announceSetWon(winnerName, match.currentSet + 1, teamAName, teamBName, newScoreA, newScoreB);
        voice.announceMatchWon(winnerName, winnerPlayers);
      } else if (analysis.setWon) {
        const winnerName = getTeamName(analysis.setWinner);
        voice.announceSetWon(winnerName, match.currentSet + 1, teamAName, teamBName, newScoreA, newScoreB);
        voice.announceCelebration();
      } else if (analysis.matchPointTeam) {
        voice.announceMatchPoint(getTeamName(analysis.matchPointTeam), teamAName, teamBName, newScoreA, newScoreB);
      } else if (analysis.setPointTeam) {
        voice.announceSetPoint(getTeamName(analysis.setPointTeam), teamAName, teamBName, newScoreA, newScoreB);
      } else if (analysis.isDeuce) {
        voice.announceDeuce(scoringTeamName);
      } else if (analysis.isInterval) {
        voice.announceInterval(teamAName, teamBName, newScoreA, newScoreB);
      } else if (newScoreA === newScoreB && newScoreA > 0) {
        voice.announceScoreEqual(scoringTeamName, opponentName, newScoreA, streak);
      } else {
        voice.announceScore(scoringTeamName, opponentName, teamAName, teamBName, newScoreA, newScoreB, streak, team, currentSet.scoreA, currentSet.scoreB);
      }


      // Update state
      setMatch((prev) => {
        const newSets = prev.sets.map((s, i) => {
          if (i === prev.currentSet) {
            return { ...s, scoreA: newScoreA, scoreB: newScoreB, winner: analysis.setWinner };
          }
          return s;
        });

        const newSetsWon = { ...prev.setsWon };
        let newCurrentSet = prev.currentSet;
        let newMatchWinner = prev.matchWinner;

        if (analysis.setWon && analysis.setWinner) {
          newSetsWon[analysis.setWinner] = (newSetsWon[analysis.setWinner] || 0) + 1;

          if (analysis.matchWon) {
            newMatchWinner = analysis.matchWinner;
          } else if (prev.currentSet < TOTAL_SETS - 1) {
            newCurrentSet = prev.currentSet + 1;
          }
        }

        return {
          ...prev,
          sets: newSets,
          setsWon: newSetsWon,
          currentSet: newCurrentSet,
          matchWinner: newMatchWinner,
          server: getNextServer(team),
          history: [...prev.history, historyEntry],
          // Pause set on set win (not match win)
          ...(analysis.setWon && !analysis.matchWon ? {
            setReady: false,
            elapsedBeforePause: prev.elapsedBeforePause + (prev.startTime ? Math.floor((Date.now() - prev.startTime) / 1000) : 0),
            startTime: null,
          } : {}),
        };
      });

      // Start break music + voice loop if set won (not match won)
      if (analysis.setWon && !analysis.matchWon) {
        voice.onVoiceDone(() => {
          playCelebrate();
          // Start break music after celebration
          setTimeout(() => {
            startBreakMusic();
            startBreakVoiceLoop();
          }, 3000);
        });
      } else if (analysis.matchWon) {
        voice.onVoiceDone(() => playCelebrate());
      }
    },
    [match, playDana, playCelebrate, startBreakMusic, triggerAnimation, triggerBumper, getTeamName, getTeamPlayers, getTeamPhotos, setMatch]
  );

  // ── Undo Point ──
  const undoPoint = useCallback(() => {
    if (match.history.length === 0) return;

    // Play chappelle-ah.mp3 + voice "revisi skor"
    playRevisi();
    voice.clearVoiceQueue();
    voice.announceRevision();

    setMatch((prev) => {
      const history = [...prev.history];
      const last = history.pop();
      if (!last) return prev;

      const newSets = prev.sets.map((s, i) => {
        if (i === last.set) {
          return { ...s, scoreA: last.scoreA, scoreB: last.scoreB, winner: null };
        }
        // Clear subsequent sets if we're undoing a set transition
        if (i > last.set) {
          return { scoreA: 0, scoreB: 0, winner: null };
        }
        return s;
      });

      return {
        ...prev,
        sets: newSets,
        currentSet: last.set,
        setsWon: last.setsWon,
        matchWinner: null,
        server: last.server,
        history,
      };
    });
  }, [match.history, playRevisi, setMatch]);

  // ── Setup Match ──
  const setupMatch = useCallback(
    (teamA, teamB, matchType, teamPhotos) => {
      voice.clearVoiceQueue();
      const newMatch = createInitialMatch();
      newMatch.teamA = teamA;
      newMatch.teamB = teamB;
      newMatch.matchType = matchType;
      newMatch.isStarted = true;
      newMatch.setReady = false; // wait for intro to finish
      newMatch.startTime = null;
      setMatch(newMatch);
      if (teamPhotos) setPhotos(teamPhotos);

      // Intro → set ready + timer starts
      voice.announceIntro(teamA, teamB, matchType, () => {
        setMatch((prev) => ({
          ...prev,
          setReady: true,
          startTime: prev.startTime || Date.now(),
        }));
      });
    },
    [setMatch, setPhotos]
  );

  // ── Reset Match ──
  const resetMatch = useCallback(() => {
    voice.clearVoiceQueue();
    stopBreakVoiceLoop();
    stopBreakMusic();
    setMatch((prev) => ({
      ...prev,
      currentSet: 0,
      sets: [
        { scoreA: 0, scoreB: 0, winner: null },
        { scoreA: 0, scoreB: 0, winner: null },
        { scoreA: 0, scoreB: 0, winner: null },
      ],
      setsWon: { a: 0, b: 0 },
      matchWinner: null,
      setReady: true,
      startTime: Date.now(),
      elapsedBeforePause: 0,
      server: "a",
      history: [],
    }));
  }, [setMatch, stopBreakMusic]);

  // ── New Match (back to setup) ──
  const newMatch = useCallback(() => {
    voice.clearVoiceQueue();
    stopBreakVoiceLoop();
    stopBreakMusic();
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PHOTOS_KEY);
    setMatch(createInitialMatch());
    setPhotos({});
  }, [setMatch, setPhotos, stopBreakMusic]);

  // ── Save team edits ──
  const saveTeamName = useCallback(
    (team, name) => {
      setMatch((prev) => ({
        ...prev,
        [team === "a" ? "teamA" : "teamB"]: {
          ...prev[team === "a" ? "teamA" : "teamB"],
          name,
        },
      }));
    },
    [setMatch]
  );

  const savePhoto = useCallback(
    (teamKey, athleteIndex, photoData) => {
      setPhotos((prev) => {
        const existing = prev[teamKey] ? [...prev[teamKey]] : [];
        if (photoData) {
          existing[athleteIndex] = photoData;
        } else {
          existing.splice(athleteIndex, 1);
        }
        const filtered = existing.filter(Boolean);
        if (filtered.length === 0) {
          const next = { ...prev };
          delete next[teamKey];
          return next;
        }
        return { ...prev, [teamKey]: filtered };
      });
    },
    [setPhotos]
  );

  // ── Break voice loop ──
  const startBreakVoiceLoop = useCallback(() => {
    stopBreakVoiceLoop();
    const loop = () => {
      if (!match.teamA?.name || !match.teamB?.name) return;
      voice.announceBreakLine(match.teamA.name, match.teamB.name);
    };
    // First one after 5s, then every 15s
    breakVoiceTimerRef.current = setTimeout(() => {
      loop();
      breakVoiceTimerRef.current = setInterval(loop, 15000);
    }, 5000);
  }, [match.teamA?.name, match.teamB?.name]);

  const stopBreakVoiceLoop = useCallback(() => {
    if (breakVoiceTimerRef.current) {
      clearInterval(breakVoiceTimerRef.current);
      clearTimeout(breakVoiceTimerRef.current);
      breakVoiceTimerRef.current = null;
    }
  }, []);

  // ── Start Set (Play button pressed) ──
  const startSet = useCallback(() => {
    voice.clearVoiceQueue();
    stopBreakVoiceLoop();
    stopBreakMusic();
    setMatch((prev) => ({
      ...prev,
      setReady: true,
      startTime: Date.now(),
    }));
  }, [setMatch, stopBreakMusic, stopBreakVoiceLoop]);

  // ── Derived state ──
  const currentSet = match.sets[match.currentSet] || { scoreA: 0, scoreB: 0 };
  const currentAnalysis = analyzePoint(
    currentSet.scoreA,
    currentSet.scoreB,
    match.setsWon.a,
    match.setsWon.b,
    match.currentSet
  );
  const isOnBreak = match.isStarted && !match.setReady && !match.matchWinner;

  return {
    match,
    photos,
    animatingTeam,
    bumper,
    currentSet,
    currentAnalysis,
    isOnBreak,
    addPoint,
    undoPoint,
    startSet,
    setupMatch,
    resetMatch,
    newMatch,
    saveTeamName,
    savePhoto,
  };
}
