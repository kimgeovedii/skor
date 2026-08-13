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
export function useScoreboard(activeTournamentId) {
  // Use dynamic keys based on the active tournament ID to keep data separated
  const storageKey = `skor-turnamen-badminton-v2-${activeTournamentId}`;
  const photosKey = `skor-turnamen-photos-${activeTournamentId}`;

  const [match, setMatch, matchRef] = useLocalStorage(storageKey, createInitialMatch());
  
  const [photos, setPhotos] = useLocalStorage(photosKey, {});
  const [animatingTeam, setAnimatingTeam] = useState(null);
  const [bumper, setBumper] = useState(null);
  const { 
    playDana, playRevisi, playCelebrate, playSpiderman,
    startCrowdAudio, stopCrowdAudio,
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

  const stopBreakVoiceLoop = useCallback(() => {
    if (breakVoiceTimerRef.current) {
      clearInterval(breakVoiceTimerRef.current);
      clearTimeout(breakVoiceTimerRef.current);
      breakVoiceTimerRef.current = null;
    }
  }, []);

  // ── Break voice (plays once) ──
  const startBreakVoiceLoop = useCallback(() => {
    stopBreakVoiceLoop();
    const playOnce = () => {
      if (!match.teamA?.name || !match.teamB?.name) return;
      voice.announceBreakLine(match.teamA.name, match.teamB.name);
    };
    // Play once after 5s
    breakVoiceTimerRef.current = setTimeout(playOnce, 5000);
  }, [match.teamA?.name, match.teamB?.name, stopBreakVoiceLoop]);

  // ── Add Point ──
  const addPoint = useCallback(
    (team) => {
      // Read the LATEST state directly from the ref (always in sync)
      const prev = matchRef.current;
      if (prev.matchWinner) return;
      if (!prev.setReady) {
        voice.announcePressPlay();
        return;
      }

      const currentSet = prev.sets[prev.currentSet];
      if (!currentSet) return;

      const newScoreA = team === "a" ? currentSet.scoreA + 1 : currentSet.scoreA;
      const newScoreB = team === "b" ? currentSet.scoreB + 1 : currentSet.scoreB;

      const analysis = analyzePoint(newScoreA, newScoreB, prev.setsWon.a, prev.setsWon.b, prev.currentSet);
      const scoringTeamName = getTeamName(team);

      const historyEntry = {
        set: prev.currentSet,
        scoreA: currentSet.scoreA,
        scoreB: currentSet.scoreB,
        server: prev.server,
        setsWon: { ...prev.setsWon },
      };

      // Play dana.mp3 IMMEDIATELY
      playDana();
      triggerAnimation(team);
      triggerBumper(team, scoringTeamName, getTeamPhotos(team));

      const wasIntro = voice.isIntroPlaying();
      voice.clearVoiceQueue();

      if (wasIntro) {
        voice.announceEarlyPoint();
      }

      // Calculate streak
      let streak = 1;
      for (let i = prev.history.length - 1; i >= 0; i--) {
        const h = prev.history[i];
        if (h.set !== prev.currentSet) break;
        const previousScorer =
          currentSet.scoreA - h.scoreA > currentSet.scoreB - h.scoreB ? "a" : "b";
        if (previousScorer === team) streak++;
        else break;
      }

      const teamAName = prev.teamA.name;
      const teamBName = prev.teamB.name;
      const opponentName = team === "a" ? teamBName : teamAName;

      if (analysis.matchWon) {
        const winnerName = getTeamName(analysis.matchWinner);
        const winnerPlayers = getTeamPlayers(analysis.matchWinner);
        voice.announceSetWon(winnerName, prev.currentSet + 1, teamAName, teamBName, newScoreA, newScoreB);
        voice.announceMatchWon(winnerName, winnerPlayers);
      } else if (analysis.setWon) {
        const winnerName = getTeamName(analysis.setWinner);
        voice.announceSetWon(winnerName, prev.currentSet + 1, teamAName, teamBName, newScoreA, newScoreB);
        voice.announceCelebration();
      } else if (analysis.matchPointTeam) {
        voice.announceConditionOnly(scoringTeamName, opponentName, newScoreA, newScoreB, streak, team, currentSet.scoreA, currentSet.scoreB);
        voice.announceMatchPoint(getTeamName(analysis.matchPointTeam), teamAName, teamBName, newScoreA, newScoreB);
      } else if (analysis.setPointTeam) {
        voice.announceConditionOnly(scoringTeamName, opponentName, newScoreA, newScoreB, streak, team, currentSet.scoreA, currentSet.scoreB);
        voice.announceSetPoint(getTeamName(analysis.setPointTeam), teamAName, teamBName, newScoreA, newScoreB);
      } else if (analysis.isDeuce) {
        voice.announceConditionOnly(scoringTeamName, opponentName, newScoreA, newScoreB, streak, team, currentSet.scoreA, currentSet.scoreB);
        voice.announceDeuce(scoringTeamName);
      } else if (analysis.isInterval) {
        voice.announceInterval(teamAName, teamBName, newScoreA, newScoreB);
      } else if (newScoreA === newScoreB && newScoreA > 0) {
        voice.announceScoreEqual(scoringTeamName, opponentName, newScoreA, streak);
      } else {
        voice.announceScore(scoringTeamName, opponentName, teamAName, teamBName, newScoreA, newScoreB, streak, team, currentSet.scoreA, currentSet.scoreB);
      }

      // Build new state
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

      const nextMatch = {
        ...prev,
        sets: newSets,
        setsWon: newSetsWon,
        currentSet: newCurrentSet,
        matchWinner: newMatchWinner,
        server: getNextServer(team),
        history: [...prev.history, historyEntry],
        startTime: wasIntro ? (prev.startTime || Date.now()) : prev.startTime,
        ...(analysis.setWon && !analysis.matchWon ? {
          setReady: false,
          elapsedBeforePause: prev.elapsedBeforePause + (prev.startTime ? Math.floor((Date.now() - prev.startTime) / 1000) : 0),
          startTime: null,
        } : {}),
      };

      // Update state — setMatch updates BOTH React state AND the ref synchronously
      setMatch(nextMatch);

      // Post-update side effects
      if (analysis.setWon && !analysis.matchWon) {
        voice.onVoiceDone(() => {
          playCelebrate();
          setTimeout(() => {
            startBreakMusic();
            startBreakVoiceLoop();
          }, 3000);
        });
      } else if (analysis.matchWon) {
        voice.onVoiceDone(() => playCelebrate());
      }
    },
    [matchRef, playDana, playCelebrate, startBreakMusic, triggerAnimation, triggerBumper, getTeamName, getTeamPlayers, getTeamPhotos, setMatch, startBreakVoiceLoop]
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

      // Play the requested meme song first
      playSpiderman();

      // Delay so it plays right before voice
      setTimeout(() => {
        // Intro → set ready + timer starts
        voice.announceIntro(teamA, teamB, matchType, () => {
          setMatch((prev) => ({
            ...prev,
            setReady: true,
            startTime: prev.startTime || Date.now(),
          }));
        });
      }, 12000);
    },
    [setMatch, setPhotos, playSpiderman]
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



  // ── Resume break state on mount (after refresh) ──
  useEffect(() => {
    if (match.isStarted && !match.setReady && !match.matchWinner) {
      // Small delay to ensure audio context is ready
      setTimeout(() => {
        startBreakMusic();
        startBreakVoiceLoop();
      }, 1000);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Start Set (Play button pressed) ──
  const startSet = useCallback(() => {
    voice.clearVoiceQueue();
    stopBreakVoiceLoop();
    stopBreakMusic();
    
    // Announce rubber set complaint if we are starting set 3
    if (match.currentSet === 2) {
      voice.announceRubberSet();
    }
    
    setMatch((prev) => ({
      ...prev,
      setReady: true,
      startTime: Date.now(),
    }));
  }, [match.currentSet, setMatch, stopBreakMusic, stopBreakVoiceLoop]);

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
  const isMatchActive = match.isStarted && match.setReady && !match.matchWinner;

  // ── Auto Crowd Audio ──
  useEffect(() => {
    if (isMatchActive) {
      startCrowdAudio();
    } else {
      stopCrowdAudio();
    }
  }, [isMatchActive, startCrowdAudio, stopCrowdAudio]);

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
