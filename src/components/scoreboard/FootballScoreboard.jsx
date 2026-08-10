import { Camera, Pencil, Undo2, Play } from "lucide-react";
import { DEFAULT_AVATAR } from "@/constants";
import { ScorePop } from "@/components/shared/ScorePop";
import { ScoreButton } from "@/components/shared/ScoreButton";
import { MatchTimer } from "@/components/shared/MatchTimer";

/**
 * TeamPanel — shows athlete photos, team name, and player names.
 */
function TeamPanel({ team, teamPhotos, side, playerNames, onEditPhoto, onEditName }) {
  const displayPhotos = [
    teamPhotos[0] || DEFAULT_AVATAR,
    teamPhotos[1] || null,
  ].filter(Boolean);

  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center py-4 md:py-8 px-3 md:px-6 ${
        side === "left"
          ? "bg-gradient-to-r from-[#0f1923] to-[#162033]"
          : "bg-gradient-to-l from-[#0f1923] to-[#162033]"
      }`}
    >
      {/* Photos */}
      <div className="flex items-center justify-center -space-x-3 mb-2">
        {displayPhotos.map((photo, i) => (
          <button
            key={i}
            onClick={() => onEditPhoto(side === "left" ? "teamA" : "teamB", i)}
            className={`w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 ${
              teamPhotos[i] ? "border-white/20" : "border-white/10"
            } bg-white/10 shadow-xl cursor-pointer hover:ring-2 hover:ring-amber-400/50 hover:scale-105 transition-all group relative`}
          >
            <img
              src={photo}
              alt={`Atlet ${i + 1}`}
              className={`w-full h-full object-cover ${!teamPhotos[i] ? "opacity-40" : ""}`}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </button>
        ))}
      </div>

      {/* Team Name */}
      <button
        onClick={() => onEditName(side === "left" ? "a" : "b", team.name)}
        className="cursor-pointer bg-transparent border-none group text-center"
      >
        <h2 className="text-white text-base md:text-xl lg:text-2xl font-black tracking-wider uppercase group-hover:text-amber-400 transition-colors leading-tight">
          {team.name}
        </h2>
      </button>

      {/* Player Names */}
      <div className="mt-1 text-center">
        {playerNames.map((name, i) => (
          <p key={i} className="text-white/40 text-[0.6rem] md:text-xs font-medium">
            {name}
          </p>
        ))}
      </div>
    </div>
  );
}

/**
 * Main badminton scoreboard — broadcast-style with set indicator.
 */
export function BadmintonScoreboard({
  match,
  photos,
  currentSet,
  currentAnalysis,
  animatingTeam,
  isOnBreak,
  onAddPoint,
  onUndo,
  onStartSet,
  onEditName,
  onEditPhoto,
}) {
  const teamA = match.teamA;
  const teamB = match.teamB;
  const photosA = photos.teamA || [];
  const photosB = photos.teamB || [];
  const isMatchOver = !!match.matchWinner;

  const getScoreClass = (team) => {
    const isAnimating = animatingTeam === team;
    return `text-5xl md:text-7xl lg:text-8xl font-black tabular-nums text-white transition-transform duration-200 ${
      isAnimating ? "scale-125" : "scale-100"
    }`;
  };

  // Badge for match/set point or deuce
  const getBadge = () => {
    if (isMatchOver) {
      const winnerName = match.matchWinner === "a" ? teamA.name : teamB.name;
      return { text: `${winnerName} Wins!`, color: "bg-amber-500 text-black", emoji: "🏆" };
    }
    if (currentAnalysis.matchPointTeam) {
      const name = currentAnalysis.matchPointTeam === "a" ? teamA.name : teamB.name;
      return { text: `Match Point — ${name}`, color: "bg-red-600 text-white animate-pulse", emoji: "🔥" };
    }
    if (currentAnalysis.setPointTeam) {
      const name = currentAnalysis.setPointTeam === "a" ? teamA.name : teamB.name;
      return { text: `Set Point — ${name}`, color: "bg-amber-500 text-black", emoji: "⚡" };
    }
    if (currentAnalysis.isDeuce) {
      return { text: "Deuce!", color: "bg-white/20 text-white", emoji: "🔄" };
    }
    return null;
  };

  const badge = getBadge();

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Main Scoreboard */}
      <div className="relative bg-gradient-to-b from-[#141b2d] to-[#0d1321] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-400 to-red-600" />

        {/* Match label */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 py-1.5 px-4 flex items-center justify-center">
          <span className="text-[0.55rem] md:text-[0.65rem] font-bold tracking-[0.3em] text-white/90 uppercase">
            🏸 {match.matchType === "singles" ? "Singles" : "Doubles"} Match
          </span>
        </div>

        {/* Score Area */}
        <div className="flex items-stretch">
          <TeamPanel
            team={teamA} teamPhotos={photosA} side="left"
            playerNames={teamA.players} onEditPhoto={onEditPhoto} onEditName={onEditName}
          />

          {/* Center Score Panel — all scores here */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0f1a] to-[#0d1321] px-4 md:px-8 lg:px-12 relative min-w-[180px] md:min-w-[260px] py-4">
            <div className="absolute left-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <div className="absolute right-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            {/* Sets Won */}
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-lg md:text-2xl font-black tabular-nums ${match.setsWon.a > match.setsWon.b ? "text-amber-400" : "text-white/50"}`}>
                {match.setsWon.a}
              </span>
              <span className="text-white/20 text-xs font-bold tracking-widest uppercase">SETS</span>
              <span className={`text-lg md:text-2xl font-black tabular-nums ${match.setsWon.b > match.setsWon.a ? "text-amber-400" : "text-white/50"}`}>
                {match.setsWon.b}
              </span>
            </div>

            {/* Current Set Label */}
            <span className="text-[0.55rem] text-amber-400/60 font-bold tracking-widest uppercase mb-1">
              Set {match.currentSet + 1}
            </span>

            {/* Game Score (big) */}
            <div className="flex items-center gap-3 md:gap-5">
              <div className="relative">
                <ScorePop active={animatingTeam === "a"} />
                <span className={getScoreClass("a")} style={{ textShadow: "0 0 40px rgba(255,255,255,0.1)" }}>
                  {currentSet.scoreA}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
              </div>

              <div className="relative">
                <ScorePop active={animatingTeam === "b"} />
                <span className={getScoreClass("b")} style={{ textShadow: "0 0 40px rgba(255,255,255,0.1)" }}>
                  {currentSet.scoreB}
                </span>
              </div>
            </div>

            {/* Completed Set Scores */}
            <div className="flex items-center gap-3 mt-2">
              {match.sets.map((s, i) => {
                if (s.winner === null && i !== match.currentSet) return null;
                const isCurrent = i === match.currentSet && !isMatchOver;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[0.55rem] font-bold ${
                      isCurrent
                        ? "bg-white/10 text-amber-400/80 ring-1 ring-amber-400/20"
                        : "bg-white/5 text-white/40"
                    }`}
                  >
                    <span>S{i + 1}</span>
                    {s.winner && (
                      <span className="font-mono">{s.scoreA}-{s.scoreB}</span>
                    )}
                    {isCurrent && !s.winner && (
                      <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <TeamPanel
            team={teamB} teamPhotos={photosB} side="right"
            playerNames={teamB.players} onEditPhoto={onEditPhoto} onEditName={onEditName}
          />
        </div>

        {/* Badge bar */}
        {badge && (
          <div className={`${badge.color} py-1.5 flex items-center justify-center gap-2`}>
            <span className="text-sm">{badge.emoji}</span>
            <span className="text-[0.65rem] md:text-xs font-bold tracking-widest uppercase">
              {badge.text}
            </span>
          </div>
        )}

        {/* Server + Timer bar */}
        <div className="bg-white/5 py-1 flex items-center justify-center gap-4">
          {!isMatchOver && (
            <span className="text-white/30 text-[0.55rem] font-semibold tracking-wider uppercase">
              Service: {match.server === "a" ? teamA.name : teamB.name}
            </span>
          )}
          <MatchTimer
            startTime={match.startTime}
            elapsedBeforePause={match.elapsedBeforePause || 0}
            isOver={isMatchOver}
            isPaused={isOnBreak}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-400 to-red-600" />
      </div>

      {/* Break overlay — Play button to start next set */}
      {isOnBreak && (
        <div className="flex flex-col items-center gap-4 mt-5">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
            <span className="text-amber-400 text-sm font-bold tracking-wider uppercase animate-pulse">
              ☕ Break — Set {match.currentSet + 1}
            </span>
          </div>
          <button
            onClick={onStartSet}
            className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold text-lg shadow-lg shadow-green-600/30 hover:shadow-green-500/50 transition-all cursor-pointer hover:scale-105 active:scale-95"
            id="btn-start-set"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>Mulai Set {match.currentSet + 1}</span>
          </button>
        </div>
      )}

      {/* Controls */}
      {!isMatchOver && !isOnBreak && (
        <div className="flex items-stretch justify-between gap-6 mt-5 px-4 md:px-16">
          <div className="flex-1 flex items-center justify-center gap-3">
            <ScoreButton type="increment" onClick={() => onAddPoint("a")} id="btn-point-a" />
            <span className="text-xs font-bold text-gray-400 tracking-wider uppercase hidden sm:block">
              {teamA.name}
            </span>
          </div>

          {/* Undo button */}
          <button
            onClick={onUndo}
            disabled={match.history.length === 0}
            className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 hover:text-white transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
            title="Undo point terakhir"
          >
            <Undo2 className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <div className="flex-1 flex items-center justify-center gap-3">
            <span className="text-xs font-bold text-gray-400 tracking-wider uppercase hidden sm:block">
              {teamB.name}
            </span>
            <ScoreButton type="increment" onClick={() => onAddPoint("b")} id="btn-point-b" />
          </div>
        </div>
      )}
    </div>
  );
}
