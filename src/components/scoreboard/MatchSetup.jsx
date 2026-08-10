import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MATCH_TYPES } from "@/constants";
import { PhotoUploadSlot } from "@/components/shared/PhotoUploadSlot";
import { processPhoto } from "@/services/imageService";

/**
 * Single team column — extracted as a top-level component
 * so React doesn't unmount/remount it on every parent re-render.
 */
function TeamForm({ side, teamName, setTeamName, players, setPlayers, teamPhotos, setTeamPhotos, playerCount, processing, onPhoto }) {
  return (
    <div className="flex-1 space-y-4">
      <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest text-center">
        {side === "a" ? "Tim A (Kiri)" : "Tim B (Kanan)"}
      </h3>

      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Nama Tim"
        className="w-full bg-red-50/50 border-2 border-red-100 rounded-xl px-4 py-2.5 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all text-sm font-semibold"
      />

      {Array.from({ length: playerCount }).map((_, i) => (
        <div key={i} className="space-y-2">
          <input
            type="text"
            value={players[i] || ""}
            onChange={(e) => {
              const n = [...players];
              n[i] = e.target.value;
              setPlayers(n);
            }}
            placeholder={`Nama Pemain ${i + 1}`}
            className="w-full bg-white border border-red-100 rounded-lg px-3 py-2 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-red-300 text-sm"
          />
          <div className="flex justify-center">
            <PhotoUploadSlot
              index={i}
              photo={teamPhotos[i]}
              processing={processing[`${side}-${i}`] || false}
              onUpload={(file) => onPhoto(side, i, file)}
              onRemovePhoto={() => {
                const n = [...teamPhotos];
                n[i] = null;
                setTeamPhotos(n);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Match setup form — select singles/doubles, enter team & player names, upload photos.
 */
export function MatchSetup({ onStart }) {
  const [matchType, setMatchType] = useState(MATCH_TYPES.DOUBLES);
  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [teamAPlayers, setTeamAPlayers] = useState(["", ""]);
  const [teamBPlayers, setTeamBPlayers] = useState(["", ""]);
  const [photosA, setPhotosA] = useState([null, null]);
  const [photosB, setPhotosB] = useState([null, null]);
  const [processing, setProcessing] = useState({});

  const isSingles = matchType === MATCH_TYPES.SINGLES;
  const playerCount = isSingles ? 1 : 2;

  const handleTypeChange = (type) => {
    setMatchType(type);
    if (type === MATCH_TYPES.SINGLES) {
      setTeamAPlayers((p) => [p[0], ""]);
      setTeamBPlayers((p) => [p[0], ""]);
      setPhotosA((p) => [p[0], null]);
      setPhotosB((p) => [p[0], null]);
    }
  };

  const handlePhoto = async (side, index, file) => {
    const key = `${side}-${index}`;
    setProcessing((p) => ({ ...p, [key]: true }));
    const result = await processPhoto(file);
    if (side === "a") {
      setPhotosA((p) => { const n = [...p]; n[index] = result; return n; });
    } else {
      setPhotosB((p) => { const n = [...p]; n[index] = result; return n; });
    }
    setProcessing((p) => ({ ...p, [key]: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!teamAName.trim() || !teamBName.trim()) return;

    const playersA = teamAPlayers.slice(0, playerCount).filter(Boolean);
    const playersB = teamBPlayers.slice(0, playerCount).filter(Boolean);
    if (playersA.length === 0 || playersB.length === 0) return;

    const teamA = { name: teamAName.trim(), players: playersA };
    const teamB = { name: teamBName.trim(), players: playersB };
    const teamPhotos = {
      teamA: photosA.slice(0, playerCount).filter(Boolean),
      teamB: photosB.slice(0, playerCount).filter(Boolean),
    };

    onStart(teamA, teamB, matchType, teamPhotos);
  };

  const isProcessingAny = Object.values(processing).some(Boolean);
  const canSubmit = teamAName.trim() &&
    teamBName.trim() &&
    teamAPlayers.slice(0, playerCount).some(Boolean) &&
    teamBPlayers.slice(0, playerCount).some(Boolean) &&
    !isProcessingAny;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-white/5 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />

        <div className="px-6 md:px-10 py-8 md:py-10">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🏸</div>
            <h2 className="text-white text-xl font-bold mb-1">Setup Pertandingan</h2>
            <p className="text-white/40 text-sm">Isi data kedua tim untuk memulai</p>
          </div>

          {/* Match Type Toggle */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[
              { type: MATCH_TYPES.SINGLES, label: "Singles" },
              { type: MATCH_TYPES.DOUBLES, label: "Doubles" },
            ].map(({ type, label }) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeChange(type)}
                className={`px-5 py-2 rounded-xl text-sm font-bold tracking-wider transition-all cursor-pointer ${
                  matchType === type
                    ? "bg-red-600 text-white shadow-lg shadow-red-500/30"
                    : "bg-white/10 text-white/50 hover:bg-white/15 hover:text-white/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-6 md:gap-8">
              <TeamForm
                side="a"
                teamName={teamAName} setTeamName={setTeamAName}
                players={teamAPlayers} setPlayers={setTeamAPlayers}
                teamPhotos={photosA} setTeamPhotos={setPhotosA}
                playerCount={playerCount}
                processing={processing} onPhoto={handlePhoto}
              />

              <div className="flex flex-col items-center justify-center px-2">
                <div className="w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <span className="text-amber-400/60 text-xs font-black my-2">VS</span>
                <div className="w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              </div>

              <TeamForm
                side="b"
                teamName={teamBName} setTeamName={setTeamBName}
                players={teamBPlayers} setPlayers={setTeamBPlayers}
                teamPhotos={photosB} setTeamPhotos={setPhotosB}
                playerCount={playerCount}
                processing={processing} onPhoto={handlePhoto}
              />
            </div>

            <div className="text-center mt-8">
              <Button
                type="submit"
                disabled={!canSubmit}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-30 disabled:hover:scale-100 text-base"
              >
                {isProcessingAny ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Play className="w-5 h-5 mr-2" />
                )}
                Mulai Pertandingan
              </Button>
            </div>
          </form>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
      </div>
    </div>
  );
}
