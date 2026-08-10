import { useEffect, useRef, useCallback } from "react";
import { BREAK_TRACKS } from "@/constants";

const SOUND_DANA = "/audio/dana.mp3";
const SOUND_REVISI = "/audio/chappelle-ah.mp3";
const SOUND_CELEBRATE = "/audio/kicaw-habibi.mp3";

/**
 * All audio playback — point, undo, celebration, + break music loop.
 */
export function useAudio() {
  const danaRef = useRef(null);
  const revisiRef = useRef(null);
  const celebRef = useRef(null);
  const breakAudioRef = useRef(null);
  const breakIndexRef = useRef(0);
  const isBreakPlayingRef = useRef(false);

  useEffect(() => {
    danaRef.current = new Audio(SOUND_DANA);
    danaRef.current.volume = 1.0;
    revisiRef.current = new Audio(SOUND_REVISI);
    revisiRef.current.volume = 1.0;
    celebRef.current = new Audio(SOUND_CELEBRATE);
    celebRef.current.volume = 1.0;
  }, []);

  const playDana = useCallback(() => {
    try { if (danaRef.current) { danaRef.current.currentTime = 0; danaRef.current.play().catch(() => {}); } } catch {}
  }, []);

  const playRevisi = useCallback(() => {
    try { if (revisiRef.current) { revisiRef.current.currentTime = 0; revisiRef.current.play().catch(() => {}); } } catch {}
  }, []);

  const playCelebrate = useCallback(() => {
    try { if (celebRef.current) { celebRef.current.currentTime = 0; celebRef.current.play().catch(() => {}); } } catch {}
  }, []);

  // ── Break music loop ──
  const playNextBreakTrack = useCallback(() => {
    if (!isBreakPlayingRef.current) return;
    const idx = breakIndexRef.current % BREAK_TRACKS.length;
    const audio = new Audio(BREAK_TRACKS[idx]);
    audio.volume = 0.5; // background volume
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
    };
  }, []);

  return { playDana, playRevisi, playCelebrate, startBreakMusic, stopBreakMusic };
}
