import { Play } from "lucide-react";

/**
 * Shown when no match is configured yet.
 */
export function EmptyState({ onSetup }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-white/5 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
        <div className="px-8 py-16 md:py-20 text-center">
          <div className="text-6xl mb-4">🏸</div>
          <h2 className="text-white/80 text-lg md:text-xl font-bold mb-2">
            Siap Bertanding?
          </h2>
          <p className="text-white/40 text-sm mb-6">
            Setup pertandingan baru untuk memulai skor badminton
          </p>
          <button
            onClick={onSetup}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-5 h-5" /> Setup Pertandingan
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
      </div>
    </div>
  );
}
