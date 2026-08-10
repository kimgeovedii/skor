/**
 * Animated ping effect shown when a score changes.
 */
export function ScorePop({ active }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
      <div className="w-full h-full rounded-2xl border-2 border-amber-400/60 animate-[ping_0.6s_ease-out_1]" />
    </div>
  );
}
