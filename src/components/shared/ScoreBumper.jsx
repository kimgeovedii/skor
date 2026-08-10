import { DEFAULT_AVATAR } from "@/constants";

/**
 * Full-screen overlay bumper animation when a team scores.
 * Shows team photo, name, and slides in from the scoring team's side.
 */
export function ScoreBumper({ bumper }) {
  if (!bumper) return null;

  const isTeamA = bumper.team === "a";

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center">
      {/* Backdrop flash */}
      <div
        className={`absolute inset-0 animate-[fadeOut_2.5s_ease-out_forwards] ${
          isTeamA
            ? "bg-gradient-to-r from-red-600/30 to-transparent"
            : "bg-gradient-to-l from-blue-600/30 to-transparent"
        }`}
      />

      {/* Bumper card */}
      <div
        className={`relative flex items-center gap-4 md:gap-6 px-6 md:px-10 py-4 md:py-6 rounded-2xl shadow-2xl border border-white/10 ${
          isTeamA
            ? "bg-gradient-to-r from-red-700/95 to-red-900/90 animate-[slideInLeft_0.4s_ease-out,fadeOut_0.5s_ease-in_2s_forwards]"
            : "bg-gradient-to-l from-blue-700/95 to-blue-900/90 animate-[slideInRight_0.4s_ease-out,fadeOut_0.5s_ease-in_2s_forwards]"
        }`}
      >
        {/* Photo */}
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-3 border-white/30 shadow-xl bg-white/10 shrink-0">
          <img
            src={bumper.photo || DEFAULT_AVATAR}
            alt={bumper.teamName}
            className={`w-full h-full object-cover ${!bumper.photo ? "opacity-50" : ""}`}
          />
        </div>

        {/* Text */}
        <div>
          <p className="text-white/60 text-[0.6rem] md:text-xs font-bold uppercase tracking-widest">
            Point!
          </p>
          <h3 className="text-white text-xl md:text-3xl font-black uppercase tracking-wide">
            {bumper.teamName}
          </h3>
        </div>

        {/* Shuttlecock icon */}
        <span className="text-3xl md:text-5xl ml-2 animate-bounce">🏸</span>
      </div>
    </div>
  );
}
