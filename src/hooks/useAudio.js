import { useEffect, useRef, useCallback } from "react";
import { BREAK_TRACKS } from "@/constants";

const SOUND_DANA = "/audio/dana.mp3";
const SOUND_REVISI = "/audio/chappelle-ah.mp3";
const SOUND_CELEBRATE = "/audio/kicaw-habibi.mp3";
const SOUND_SPIDERMAN = "/audio/spiderman-meme-song.mp3";
const SOUND_CROWD = "/audio/suporter.mp3";

/**
 * All audio playback — point, undo, celebration, + break music loop.
 */
export function useAudio() {
  const danaRef = useRef(null);
  const revisiRef = useRef(null);
  const celebRef = useRef(null);
  const spidermanRef = useRef(null);
  const crowdAudioRef = useRef(null);
  const breakAudioRef = useRef(null);
  const breakIndexRef = useRef(0);
  const isBreakPlayingRef = useRef(false);
  const shouldCrowdPlayRef = useRef(false);
  const duckCountRef = useRef(0);

  useEffect(() => {
    danaRef.current = new Audio(SOUND_DANA);
    danaRef.current.volume = 1.0;
    revisiRef.current = new Audio(SOUND_REVISI);
    revisiRef.current.volume = 1.0;
    celebRef.current = new Audio(SOUND_CELEBRATE);
    celebRef.current.volume = 1.0;
    spidermanRef.current = new Audio(SOUND_SPIDERMAN);
    spidermanRef.current.volume = 1.0;
    crowdAudioRef.current = new Audio(SOUND_CROWD);
    crowdAudioRef.current.volume = 0.4; // Default crowd volume
    crowdAudioRef.current.loop = true;
  }, []);

  const duckSourcesRef = useRef(new Set());

  const addDuckSource = useCallback((sourceId) => {
    duckSourcesRef.current.add(sourceId);
    if (breakAudioRef.current) breakAudioRef.current.volume = 0.1;
    if (crowdAudioRef.current) crowdAudioRef.current.volume = 0.02;
  }, []);

  const removeDuckSource = useCallback((sourceId) => {
    duckSourcesRef.current.delete(sourceId);
    if (duckSourcesRef.current.size === 0) {
      setTimeout(() => {
        if (duckSourcesRef.current.size === 0) {
          if (breakAudioRef.current) breakAudioRef.current.volume = 0.5;
          if (crowdAudioRef.current) crowdAudioRef.current.volume = 0.4;
        }
      }, 500);
    }
  }, []);

  const duckBreakMusic = useCallback(() => addDuckSource('voice'), [addDuckSource]);
  const unduckBreakMusic = useCallback(() => removeDuckSource('voice'), [removeDuckSource]);

  const ensureCrowdPlaying = useCallback(() => {
    if (shouldCrowdPlayRef.current && crowdAudioRef.current && crowdAudioRef.current.paused) {
      crowdAudioRef.current.volume = duckSourcesRef.current.size > 0 ? 0.02 : 0.4;
      crowdAudioRef.current.play().catch(() => {});
    }
  }, []);

  const playDana = useCallback(() => {
    ensureCrowdPlaying();
    try { 
      if (danaRef.current) { 
        addDuckSource('dana');
        danaRef.current.currentTime = 0; 
        danaRef.current.play().catch(() => removeDuckSource('dana')); 
        danaRef.current.onended = () => removeDuckSource('dana');
      } 
    } catch {}
  }, [addDuckSource, removeDuckSource, ensureCrowdPlaying]);

  const playRevisi = useCallback(() => {
    ensureCrowdPlaying();
    try { 
      if (revisiRef.current) { 
        addDuckSource('revisi');
        revisiRef.current.currentTime = 0; 
        revisiRef.current.play().catch(() => removeDuckSource('revisi')); 
        revisiRef.current.onended = () => removeDuckSource('revisi');
      } 
    } catch {}
  }, [addDuckSource, removeDuckSource, ensureCrowdPlaying]);

  const playCelebrate = useCallback(() => {
    ensureCrowdPlaying();
    try { 
      if (celebRef.current) { 
        addDuckSource('celeb');
        celebRef.current.currentTime = 0; 
        celebRef.current.play().catch(() => removeDuckSource('celeb')); 
        celebRef.current.onended = () => removeDuckSource('celeb');
      } 
    } catch {}
  }, [addDuckSource, removeDuckSource, ensureCrowdPlaying]);

  const playSpiderman = useCallback(() => {
    ensureCrowdPlaying();
    try { 
      if (spidermanRef.current) { 
        addDuckSource('spiderman');
        spidermanRef.current.currentTime = 0; 
        spidermanRef.current.play().catch(() => removeDuckSource('spiderman')); 
        spidermanRef.current.onended = () => removeDuckSource('spiderman');
      } 
    } catch {}
  }, [addDuckSource, removeDuckSource, ensureCrowdPlaying]);

  const startCrowdAudio = useCallback(() => {
    shouldCrowdPlayRef.current = true;
    try { 
      if (crowdAudioRef.current) { 
        crowdAudioRef.current.volume = duckSourcesRef.current.size > 0 ? 0.02 : 0.4;
        crowdAudioRef.current.play().catch(() => {}); 
      } 
    } catch {}
  }, []);

  const stopCrowdAudio = useCallback(() => {
    shouldCrowdPlayRef.current = false;
    try { 
      if (crowdAudioRef.current) { 
        crowdAudioRef.current.pause(); 
      } 
    } catch {}
  }, []);

  // ── Break music loop ──
  const playNextBreakTrack = useCallback(() => {
    if (!isBreakPlayingRef.current) return;
    const idx = breakIndexRef.current % BREAK_TRACKS.length;
    const audio = new Audio(BREAK_TRACKS[idx]);
    audio.volume = 0.5; // Default background volume
    breakAudioRef.current = audio;
    audio.onended = () => {
      breakIndexRef.current = idx + 1;
      playNextBreakTrack();
    };
    audio.onerror = () => {
      // Skip to next track if file missing
      breakIndexRef.current = idx + 1;
      setTimeout(() => playNextBreakTrack(), 500);
    };
    audio.play().catch(() => {
      breakIndexRef.current = idx + 1;
      setTimeout(() => playNextBreakTrack(), 500);
    });
  }, []);

  const startBreakMusic = useCallback(() => {
    isBreakPlayingRef.current = true;
    breakIndexRef.current = 0;
    playNextBreakTrack();
  }, [playNextBreakTrack]);

  const stopBreakMusic = useCallback(() => {
    isBreakPlayingRef.current = false;
    if (breakAudioRef.current) {
      breakAudioRef.current.pause();
      breakAudioRef.current.currentTime = 0;
      breakAudioRef.current = null;
    }
  }, []);


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isBreakPlayingRef.current = false;
      if (breakAudioRef.current) {
        breakAudioRef.current.pause();
        breakAudioRef.current = null;
      }
      if (crowdAudioRef.current) {
        crowdAudioRef.current.pause();
        crowdAudioRef.current = null;
      }
    };
  }, []);

  return { 
    playDana,
    playRevisi,
    playCelebrate,
    playSpiderman,
    startCrowdAudio,
    stopCrowdAudio,
    startBreakMusic,
    stopBreakMusic,
    duckBreakMusic, unduckBreakMusic 
  };
}
