import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

/**
 * Live elapsed match timer — supports cumulative timing across sets.
 * elapsedBeforePause = accumulated seconds from previous sets.
 */
export function MatchTimer({ startTime, elapsedBeforePause = 0, isOver, isPaused }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const update = () => {
      const currentSetTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      setElapsed(elapsedBeforePause + currentSetTime);
    };
    update();

    if (isOver || isPaused || !startTime) return;

    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startTime, elapsedBeforePause, isOver, isPaused]);

  if (!startTime && elapsedBeforePause === 0) return null;

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const display = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-1.5 text-white/40">
      <Clock className="w-3 h-3" />
      <span className={`text-xs font-mono font-bold tracking-wider ${isPaused ? "animate-pulse text-amber-400/60" : ""}`}>
        {display}
      </span>
    </div>
  );
}
