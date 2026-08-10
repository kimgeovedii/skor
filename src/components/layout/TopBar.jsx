import { useState, useEffect, useCallback } from "react";
import { Maximize, Minimize, RotateCcw, Plus, Languages } from "lucide-react";
import { setVoiceLanguage, getVoiceLanguage } from "@/services/voiceService";

/**
 * Fixed top-right toolbar with language toggle.
 */
export function TopBar({ isMatchStarted, isMatchOver, onResetMatch, onNewMatch }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [voiceLang, setVoiceLang] = useState(() => {
    const saved = localStorage.getItem("voice-lang");
    if (saved) { setVoiceLanguage(saved); return saved; }
    return "en";
  });

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const toggleLang = () => {
    const next = voiceLang === "en" ? "id" : "en";
    setVoiceLang(next);
    setVoiceLanguage(next);
    localStorage.setItem("voice-lang", next);
  };

  return (
    <div className="fixed top-3 right-4 z-50 flex items-center gap-2">
      {/* Language toggle */}
      <button
        onClick={toggleLang}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-200 text-red-600 hover:text-red-700 transition-all cursor-pointer text-xs font-bold"
        title={`Voice: ${voiceLang === "en" ? "English" : "Indonesia"}`}
      >
        <Languages className="w-4 h-4" />
        <span className="uppercase tracking-wider">{voiceLang === "en" ? "EN" : "ID"}</span>
      </button>

      {isMatchStarted && !isMatchOver && (
        <button
          onClick={onResetMatch}
          className="p-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-200 text-red-600 hover:text-red-700 transition-all cursor-pointer"
          title="Reset skor pertandingan"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      )}
      {isMatchOver && (
        <button
          onClick={onNewMatch}
          className="p-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-200 text-red-600 hover:text-red-700 transition-all cursor-pointer"
          title="Pertandingan baru"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}
      <button
        onClick={toggleFullscreen}
        className="p-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-200 text-red-600 hover:text-red-700 transition-all cursor-pointer"
        id="btn-fullscreen"
        title={isFullscreen ? "Keluar fullscreen" : "Mode fullscreen"}
      >
        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
      </button>
    </div>
  );
}
