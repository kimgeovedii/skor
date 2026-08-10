import { TOTAL_SETS } from "@/constants";

/**
 * Horizontal set status indicator showing Set 1 / Set 2 / Set 3.
 * Shows scores for completed sets and highlights current set.
 */
export function SetIndicator({ sets, currentSet, setsWon, matchWinner }) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      {Array.from({ length: TOTAL_SETS }).map((_, i) => {
        const set = sets[i];
        const isDone = set?.winner !== null;
        const isCurrent = i === currentSet && !matchWinner;
        const isFuture = i > currentSet && !matchWinner;

        return (
          <div
            key={i}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              isCurrent
                ? "bg-white/15 text-white ring-1 ring-amber-400/40 shadow-sm shadow-amber-400/10"
                : isDone
                  ? "bg-white/5 text-white/60"
                  : "bg-white/5 text-white/20"
            }`}
          >
            <span className={`${isCurrent ? "text-amber-400" : ""}`}>
              Set {i + 1}
            </span>
            {isDone && (
              <span className="text-amber-400/70 font-mono">
                {set.scoreA}-{set.scoreB}
              </span>
            )}
            {isCurrent && !isDone && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            )}
          </div>
        );
      })}

      {/* Sets won badges */}
      <div className="flex items-center gap-1 ml-2 pl-2 border-l border-white/10">
        <span className="text-[0.6rem] text-white/30 font-semibold mr-1">SETS</span>
        <span className={`w-5 h-5 rounded text-[0.6rem] font-black flex items-center justify-center ${
          setsWon.a > 0 ? "bg-amber-400/20 text-amber-400" : "bg-white/5 text-white/20"
        }`}>
          {setsWon.a}
        </span>
        <span className="text-white/15 text-[0.5rem]">:</span>
        <span className={`w-5 h-5 rounded text-[0.6rem] font-black flex items-center justify-center ${
          setsWon.b > 0 ? "bg-amber-400/20 text-amber-400" : "bg-white/5 text-white/20"
        }`}>
          {setsWon.b}
        </span>
      </div>
    </div>
  );
}
