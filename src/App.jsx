import { useState, useCallback, useEffect, useRef } from "react";
import { removeBackground } from "@imgly/background-removal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Plus,
  Minus,
  RotateCcw,
  Maximize,
  Minimize,
  Trash2,
  UserPlus,
  Upload,
  Loader2,
  Camera,
  Pencil,
} from "lucide-react";

const STORAGE_KEY = "skor-turnamen-badminton";
const PHOTOS_KEY = "skor-turnamen-photos";
const SOUND_INCREMENT = "/audio/fahhhhhhhhhhhhhh.mp3";
const SOUND_DECREMENT = "/audio/fahhhhhhhhhhhhhh.mp3";
const PHOTO_MAX_SIZE = 400;
const DEFAULT_AVATAR = "/default-athlete.png";

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

/* ── Resize ── */
function resizeImage(file, maxSize = PHOTO_MAX_SIZE) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ── BG Removal ── */
async function processBackgroundRemoval(file) {
  try {
    const blob = await removeBackground(file, {
      output: { format: "image/png" },
    });
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          if (width > height) {
            if (width > PHOTO_MAX_SIZE) {
              height = (height * PHOTO_MAX_SIZE) / width;
              width = PHOTO_MAX_SIZE;
            }
          } else {
            if (height > PHOTO_MAX_SIZE) {
              width = (width * PHOTO_MAX_SIZE) / height;
              height = PHOTO_MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/png", 0.9));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("BG removal failed:", err);
    return resizeImage(file);
  }
}

/* ── Clickable Athlete Photos on Scoreboard ── */
function AthletePhotos({ photos, size = "md", onClickPhoto }) {
  if (!photos || photos.length === 0) {
    // No photos — show placeholders that can be clicked to add
    if (!onClickPhoto) return null;
    return (
      <div className="flex items-center justify-center -space-x-3 mb-2">
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => onClickPhoto(i)}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center cursor-pointer hover:border-amber-400/50 hover:bg-white/10 transition-all group"
            title={`Upload foto atlet ${i + 1}`}
          >
            <Camera className="w-5 h-5 text-white/30 group-hover:text-amber-400/60 transition-colors" />
          </button>
        ))}
      </div>
    );
  }

  const sizes = {
    sm: "w-14 h-14",
    md: "w-20 h-20 md:w-24 md:h-24",
    lg: "w-24 h-24 md:w-32 md:h-32",
  };

  return (
    <div className="flex items-center justify-center -space-x-4 mb-2">
      {photos.map((photo, i) => (
        <button
          key={i}
          onClick={() => onClickPhoto?.(i)}
          className={`${sizes[size]} rounded-full overflow-hidden border-3 border-white/25 bg-white/10 shadow-xl ring-1 ring-black/5 cursor-pointer hover:ring-2 hover:ring-amber-400/50 hover:scale-110 transition-all group relative`}
          title={`Klik untuk ganti foto atlet ${i + 1}`}
        >
          <img
            src={photo}
            alt={`Atlet ${i + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </button>
      ))}
      {/* If only 1 photo, show a plus for the 2nd slot */}
      {photos.length === 1 && onClickPhoto && (
        <button
          onClick={() => onClickPhoto(1)}
          className={`${sizes[size]} rounded-full border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center cursor-pointer hover:border-amber-400/50 hover:bg-white/10 transition-all group`}
          title="Tambah foto atlet 2"
        >
          <Plus className="w-5 h-5 text-white/30 group-hover:text-amber-400/60 transition-colors" />
        </button>
      )}
    </div>
  );
}

/* ── Photo Upload Slot (for dialogs) ── */
function PhotoUploadSlot({
  index,
  photo,
  onUpload,
  processing,
  onRemovePhoto,
}) {
  const inputRef = useRef(null);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <label className="text-xs font-semibold text-gray-500">
        Atlet {index + 1}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={processing}
        className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-red-200 hover:border-red-400 bg-red-50/50 flex items-center justify-center transition-all cursor-pointer overflow-hidden disabled:opacity-50 disabled:cursor-wait group"
      >
        {processing ? (
          <div className="flex flex-col items-center gap-1">
            <Loader2 className="w-6 h-6 text-red-400 animate-spin" />
            <span className="text-[0.6rem] text-red-400">Proses...</span>
          </div>
        ) : photo ? (
          <>
            <img
              src={photo}
              alt={`Atlet ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-red-300">
            <Upload className="w-6 h-6" />
            <span className="text-[0.6rem]">Upload Foto</span>
          </div>
        )}
      </button>
      {photo && !processing && (
        <button
          type="button"
          onClick={onRemovePhoto}
          className="text-[0.6rem] text-red-400 hover:text-red-600 cursor-pointer"
        >
          Hapus foto
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ── Score pop ── */
function ScorePop({ active }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
      <div className="w-full h-full rounded-2xl border-2 border-amber-400/60 animate-[ping_0.6s_ease-out_1]" />
    </div>
  );
}

/* ══════ EMPTY STATE ══════ */
function EmptyState({ onAddTeam }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-white/5 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
        <div className="px-8 py-16 md:py-20 text-center">
          <div className="text-6xl mb-4">🏸</div>
          <h2 className="text-white/80 text-lg md:text-xl font-bold mb-2">
            Belum Ada Tim
          </h2>
          <p className="text-white/40 text-sm mb-6">
            Tambahkan minimal 2 tim untuk memulai pertandingan
          </p>
          <button
            onClick={onAddTeam}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-5 h-5" /> Tambah Tim
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
      </div>
    </div>
  );
}

/* ══════ SINGLE TEAM ══════ */
function SingleTeamState({
  player,
  photos,
  onAddTeam,
  onEditName,
  onEditPhoto,
}) {
  const teamPhotos = photos[player.id] || [];
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-white/5 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
        <div className="px-8 py-12 md:py-16 text-center">
          <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-4">
            Tim Terdaftar
          </p>
          <AthletePhotos
            photos={teamPhotos}
            size="lg"
            onClickPhoto={(i) => onEditPhoto(player.id, i)}
          />
          <button
            onClick={() => onEditName(player)}
            className="group cursor-pointer bg-transparent border-none"
          >
            <h2 className="text-white text-2xl md:text-3xl font-black tracking-wider uppercase mb-1 group-hover:text-amber-400 transition-colors">
              {player.name}
            </h2>
            <span className="text-white/30 text-[0.6rem] flex items-center justify-center gap-1 group-hover:text-amber-400/60">
              <Pencil className="w-3 h-3" /> Klik untuk edit nama
            </span>
          </button>
          <p className="text-white/40 text-sm mb-6 mt-4">
            Tambahkan 1 tim lagi untuk memulai
          </p>
          <button
            onClick={onAddTeam}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-5 h-5" /> Tambah Tim Lawan
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
      </div>
    </div>
  );
}

/* ══════ FOOTBALL SCOREBOARD ══════ */
function FootballScoreboard({
  players,
  photos,
  highestScore,
  hasWinner,
  animatingId,
  onIncrement,
  onDecrement,
  onEditName,
  onEditPhoto,
}) {
  const teamA = players[0];
  const teamB = players[1];
  const photosA = photos[teamA.id] || [];
  const photosB = photos[teamB.id] || [];

  const TeamPanel = ({ team, teamPhotos, side }) => {
    // Build display photos: use uploaded photos or default avatars
    const displayPhotos = [
      teamPhotos[0] || DEFAULT_AVATAR,
      teamPhotos[1] || DEFAULT_AVATAR,
    ];

    return (
    <div className={`flex-1 flex flex-col items-center justify-center py-6 md:py-10 px-4 md:px-8 ${side === "left" ? "bg-gradient-to-r from-[#0f1923] to-[#162033]" : "bg-gradient-to-l from-[#0f1923] to-[#162033]"}`}>
      {/* Photos — always show 2 avatars */}
      <div className="flex items-center justify-center -space-x-4 mb-3">
        {displayPhotos.map((photo, i) => (
          <button
            key={i}
            onClick={() => onEditPhoto(team.id, i)}
            className={`w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-3 ${teamPhotos[i] ? "border-white/20" : "border-white/10"} bg-white/10 shadow-xl cursor-pointer hover:ring-2 hover:ring-amber-400/50 hover:scale-105 transition-all group relative`}
            title={teamPhotos[i] ? `Ganti foto atlet ${i + 1}` : `Upload foto atlet ${i + 1}`}
          >
            <img src={photo} alt={`Atlet ${i + 1}`} className={`w-full h-full object-cover ${!teamPhotos[i] ? "opacity-40" : ""}`} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </button>
        ))}
      </div>

      {/* Team Name */}
      <button
        onClick={() => onEditName(team)}
        className="cursor-pointer bg-transparent border-none group text-center"
      >
        <h2 className="text-white text-lg md:text-2xl lg:text-3xl font-black tracking-wider uppercase group-hover:text-amber-400 transition-colors leading-tight">
          {team.name}
        </h2>
        <span className="text-white/15 text-[0.5rem] flex items-center justify-center gap-1 mt-1 group-hover:text-amber-400/40 transition-colors">
          <Pencil className="w-2.5 h-2.5" /> edit
        </span>
      </button>
    </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Main Scoreboard */}
      <div className="relative bg-gradient-to-b from-[#141b2d] to-[#0d1321] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/5">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-400 to-red-600" />

        {/* Match label bar */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 py-1.5 px-4 flex items-center justify-center">
          <span className="text-[0.6rem] md:text-xs font-bold tracking-[0.3em] text-white/90 uppercase">
            🏸 Badminton Match
          </span>
        </div>

        {/* Score Area */}
        <div className="flex items-stretch">
          {/* Team A Panel */}
          <TeamPanel team={teamA} teamPhotos={photosA} side="left" />

          {/* Center Score */}
          <div className="flex items-center justify-center bg-gradient-to-b from-[#0a0f1a] to-[#0d1321] px-4 md:px-8 lg:px-12 relative">
            {/* Vertical dividers */}
            <div className="absolute left-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <div className="absolute right-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            <div className="flex items-center gap-3 md:gap-5">
              {/* Score A */}
              <div className="relative">
                <ScorePop active={animatingId === teamA.id} />
                <span
                  className={`text-6xl md:text-8xl lg:text-9xl font-black tabular-nums text-white transition-transform duration-200 ${animatingId === teamA.id ? "scale-125" : "scale-100"} ${hasWinner && teamA.score === highestScore && teamA.score > 0 ? "text-amber-400" : ""}`}
                  style={{ textShadow: "0 0 40px rgba(255,255,255,0.1)" }}
                >
                  {teamA.score}
                </span>
              </div>

              {/* Separator */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-amber-400/60" />
                <div className="w-1 h-1 rounded-full bg-amber-400/60" />
              </div>

              {/* Score B */}
              <div className="relative">
                <ScorePop active={animatingId === teamB.id} />
                <span
                  className={`text-6xl md:text-8xl lg:text-9xl font-black tabular-nums text-white transition-transform duration-200 ${animatingId === teamB.id ? "scale-125" : "scale-100"} ${hasWinner && teamB.score === highestScore && teamB.score > 0 ? "text-amber-400" : ""}`}
                  style={{ textShadow: "0 0 40px rgba(255,255,255,0.1)" }}
                >
                  {teamB.score}
                </span>
              </div>
            </div>
          </div>

          {/* Team B Panel */}
          <TeamPanel team={teamB} teamPhotos={photosB} side="right" />
        </div>

        {/* Winner bar */}
        {hasWinner && (
          <div className="bg-gradient-to-r from-amber-600/20 via-amber-500/30 to-amber-600/20 py-1.5 flex items-center justify-center gap-2">
            <span className="text-sm">🏸</span>
            <span className="text-amber-400 text-[0.65rem] md:text-xs font-bold tracking-widest uppercase">
              {players.find((p) => p.score === highestScore)?.name} Unggul
            </span>
          </div>
        )}

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-400 to-red-600" />
      </div>

      {/* Controls */}
      <div className="flex items-stretch justify-between gap-6 mt-5 px-4 md:px-16">
        <div className="flex-1 flex items-center justify-center gap-3">
          <button
            onClick={() => onDecrement(teamA.id)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
            id="btn-decrement-a"
          >
            <Minus className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase hidden sm:block">
            {teamA.name}
          </span>
          <button
            onClick={() => onIncrement(teamA.id)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
            id="btn-increment-a"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center gap-3">
          <button
            onClick={() => onDecrement(teamB.id)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
            id="btn-decrement-b"
          >
            <Minus className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase hidden sm:block">
            {teamB.name}
          </span>
          <button
            onClick={() => onIncrement(teamB.id)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
            id="btn-increment-b"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════ MULTI-TEAM GRID ══════ */
function MultiTeamGrid({
  players,
  photos,
  highestScore,
  hasWinner,
  animatingId,
  onIncrement,
  onDecrement,
  onRemove,
  onEditName,
  onEditPhoto,
}) {
  const cardColors = [
    "from-red-700 to-red-800",
    "from-slate-700 to-slate-800",
    "from-amber-600 to-amber-700",
    "from-blue-700 to-blue-800",
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 w-full max-w-4xl mx-auto">
      {players.map((player, idx) => {
        const teamPhotos = photos[player.id] || [];
        return (
          <div key={player.id} className="relative group">
            <button
              onClick={() => onRemove(player.id)}
              className="absolute -top-2 -right-2 z-20 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
              title="Hapus tim"
            >
              ✕
            </button>
            <div
              className={`relative bg-gradient-to-br ${cardColors[idx % cardColors.length]} rounded-2xl overflow-hidden shadow-xl border border-white/10`}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400/50 via-white/20 to-amber-400/50" />
              <div className="p-4 md:p-6 text-center">
                {hasWinner &&
                  player.score === highestScore &&
                  player.score > 0 && (
                    <div className="mb-1 animate-bounce">
                      <span className="text-2xl">🏸</span>
                    </div>
                  )}
                <AthletePhotos
                  photos={teamPhotos}
                  size="md"
                  onClickPhoto={(i) => onEditPhoto(player.id, i)}
                />
                <button
                  onClick={() => onEditName(player)}
                  className="cursor-pointer bg-transparent border-none group/name"
                >
                  <h3 className="text-white/80 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-1 group-hover/name:text-amber-400 transition-colors">
                    {player.name}
                  </h3>
                  <span className="text-white/20 text-[0.5rem] flex items-center justify-center gap-1 group-hover/name:text-amber-400/50">
                    <Pencil className="w-2 h-2" /> edit
                  </span>
                </button>
                <div className="relative mt-2">
                  <ScorePop active={animatingId === player.id} />
                  <span
                    className={`text-5xl md:text-7xl font-black tabular-nums text-white transition-transform duration-200 ${animatingId === player.id ? "scale-110" : "scale-100"}`}
                    style={{ textShadow: "0 0 20px rgba(255,255,255,0.1)" }}
                  >
                    {player.score}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 mt-3">
              <button
                onClick={() => onDecrement(player.id)}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                onClick={() => onIncrement(player.id)}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════ ADD TEAM DIALOG (both slots) ══════ */
function AddTeamDialog({ open, onOpenChange, onAdd, teamCount }) {
  const [name, setName] = useState("");
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [processing1, setProcessing1] = useState(false);
  const [processing2, setProcessing2] = useState(false);
  const remaining = 4 - teamCount;

  const handlePhoto = async (file, setPhoto, setProcessing) => {
    setProcessing(true);
    try {
      setPhoto(await processBackgroundRemoval(file));
    } catch {
      setPhoto(await resizeImage(file));
    }
    setProcessing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), [photo1, photo2].filter(Boolean));
    setName("");
    setPhoto1(null);
    setPhoto2(null);
  };

  const isProcessing = processing1 || processing2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-red-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-red-700 text-lg flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Tambah Tim Baru
          </DialogTitle>
          <DialogDescription>
            Masukkan nama tim dan foto atlet. Background akan dihapus otomatis.
            Sisa slot: <strong className="text-red-600">{remaining}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Tim Garuda"
            autoFocus
            className="w-full bg-red-50/50 border-2 border-red-100 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all"
            id="input-team-name"
          />
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Foto Atlet{" "}
              <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <div className="flex items-center justify-center gap-6">
              <PhotoUploadSlot
                index={0}
                photo={photo1}
                processing={processing1}
                onUpload={(f) => handlePhoto(f, setPhoto1, setProcessing1)}
                onRemovePhoto={() => setPhoto1(null)}
              />
              <PhotoUploadSlot
                index={1}
                photo={photo2}
                processing={processing2}
                onUpload={(f) => handlePhoto(f, setPhoto2, setProcessing2)}
                onRemovePhoto={() => setPhoto2(null)}
              />
            </div>
            {isProcessing && (
              <p className="text-xs text-amber-600 mt-2 text-center flex items-center justify-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" /> Menghapus
                background foto...
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <DialogClose>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-gray-200 cursor-pointer"
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!name.trim() || isProcessing}
              className="bg-red-600 hover:bg-red-500 text-white rounded-xl px-6 cursor-pointer disabled:opacity-30 shadow-md shadow-red-200"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-1.5" />
              )}{" "}
              Tambah
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ══════ EDIT NAME DIALOG ══════ */
function EditNameDialog({ open, onOpenChange, player, onSave }) {
  const [name, setName] = useState("");
  useEffect(() => {
    if (open && player) setName(player.name);
  }, [open, player]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(player.id, name.trim());
      onOpenChange(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-white border-red-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-red-700 text-lg flex items-center gap-2">
            <Pencil className="w-5 h-5" /> Edit Nama Tim
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full bg-red-50/50 border-2 border-red-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all"
          />
          <DialogFooter className="gap-2">
            <DialogClose>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-gray-200 cursor-pointer"
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="bg-red-600 hover:bg-red-500 text-white rounded-xl px-6 cursor-pointer disabled:opacity-30 shadow-md shadow-red-200"
            >
              <Pencil className="w-4 h-4 mr-1.5" /> Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ══════ EDIT SINGLE PHOTO DIALOG ══════ */
function EditPhotoDialog({
  open,
  onOpenChange,
  teamId,
  athleteIndex,
  currentPhoto,
  onSave,
}) {
  const [photo, setPhoto] = useState(null);
  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    if (open) setPhoto(currentPhoto || null);
  }, [open, currentPhoto]);

  const handleUpload = async (file) => {
    setProcessing(true);
    try {
      setPhoto(await processBackgroundRemoval(file));
    } catch {
      setPhoto(await resizeImage(file));
    }
    setProcessing(false);
  };

  const handleSave = () => {
    onSave(teamId, athleteIndex, photo);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs bg-white border-red-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-red-700 text-lg flex items-center gap-2">
            <Camera className="w-5 h-5" /> Foto Atlet {athleteIndex + 1}
          </DialogTitle>
          <DialogDescription>
            Upload atau ganti foto atlet. Background akan dihapus otomatis.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 py-2">
          <PhotoUploadSlot
            index={athleteIndex}
            photo={photo}
            processing={processing}
            onUpload={handleUpload}
            onRemovePhoto={() => setPhoto(null)}
          />
          {processing && (
            <p className="text-xs text-amber-600 flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" /> Menghapus
              background...
            </p>
          )}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-gray-200 cursor-pointer"
            >
              Batal
            </Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            disabled={processing}
            className="bg-red-600 hover:bg-red-500 text-white rounded-xl px-6 cursor-pointer disabled:opacity-30 shadow-md shadow-red-200"
          >
            {processing ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Camera className="w-4 h-4 mr-1.5" />
            )}{" "}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ══════ MAIN APP ══════ */
function App() {
  const [players, setPlayers] = useLocalStorage(STORAGE_KEY, []);
  const [photos, setPhotos] = useLocalStorage(PHOTOS_KEY, {});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animatingId, setAnimatingId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editNamePlayer, setEditNamePlayer] = useState(null);
  const [editPhoto, setEditPhoto] = useState(null); // { teamId, athleteIndex }
  const audioIncRef = useRef(null);
  const audioDecRef = useRef(null);
  const colorCycle = ["red", "white", "gold", "blue"];

  useEffect(() => {
    audioIncRef.current = new Audio(SOUND_INCREMENT);
    audioIncRef.current.volume = 1.0;
    audioDecRef.current = new Audio(SOUND_DECREMENT);
    audioDecRef.current.volume = 1.0;
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const playSound = useCallback((type) => {
    try {
      const a =
        type === "increment" ? audioIncRef.current : audioDecRef.current;
      if (a) {
        a.currentTime = 0;
        a.play().catch(() => {});
      }
    } catch {}
  }, []);
  const triggerAnimation = useCallback((id) => {
    setAnimatingId(id);
    setTimeout(() => setAnimatingId(null), 600);
  }, []);

  const handleIncrement = useCallback(
    (id) => {
      setPlayers((p) =>
        p.map((t) => (t.id === id ? { ...t, score: t.score + 1 } : t)),
      );
      playSound("increment");
      triggerAnimation(id);
    },
    [playSound, triggerAnimation, setPlayers],
  );

  const handleDecrement = useCallback(
    (id) => {
      const pl = players.find((p) => p.id === id);
      if (pl && pl.score <= 0) return;
      setPlayers((p) =>
        p.map((t) =>
          t.id === id ? { ...t, score: Math.max(0, t.score - 1) } : t,
        ),
      );
      playSound("decrement");
      triggerAnimation(id);
    },
    [playSound, triggerAnimation, setPlayers, players],
  );

  const resetAll = useCallback(() => {
    setPlayers((p) => p.map((t) => ({ ...t, score: 0 })));
  }, [setPlayers]);
  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PHOTOS_KEY);
    setPlayers([]);
    setPhotos({});
  }, [setPlayers, setPhotos]);

  const addPlayer = useCallback(
    (name, playerPhotos = []) => {
      if (players.length >= 4) return;
      const id = Date.now();
      setPlayers((p) => [
        ...p,
        { id, name, score: 0, color: colorCycle[p.length % colorCycle.length] },
      ]);
      if (playerPhotos.length > 0)
        setPhotos((p) => ({ ...p, [id]: playerPhotos }));
      if (players.length + 1 >= 2) setAddDialogOpen(false);
    },
    [players.length, setPlayers, setPhotos],
  );

  const removePlayer = useCallback(
    (id) => {
      setPlayers((p) => p.filter((t) => t.id !== id));
      setPhotos((p) => {
        const n = { ...p };
        delete n[id];
        return n;
      });
    },
    [setPlayers, setPhotos],
  );

  const saveName = useCallback(
    (id, name) => {
      setPlayers((p) => p.map((t) => (t.id === id ? { ...t, name } : t)));
    },
    [setPlayers],
  );

  const savePhoto = useCallback(
    (teamId, athleteIndex, photoData) => {
      setPhotos((prev) => {
        const existing = prev[teamId] ? [...prev[teamId]] : [];
        if (photoData) {
          existing[athleteIndex] = photoData;
        } else {
          existing.splice(athleteIndex, 1);
        }
        const filtered = existing.filter(Boolean);
        if (filtered.length === 0) {
          const next = { ...prev };
          delete next[teamId];
          return next;
        }
        return { ...prev, [teamId]: filtered };
      });
    },
    [setPhotos],
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement)
      document.documentElement.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  }, []);

  const highestScore = Math.max(...players.map((p) => p.score), 0);
  const hasWinner = highestScore > 0 && players.length >= 2;

  // Get current photo for edit dialog
  const editPhotoCurrentPhoto = editPhoto
    ? (photos[editPhoto.teamId] || [])[editPhoto.athleteIndex] || null
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50 text-gray-900 overflow-hidden relative">
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 z-40" />
      <div className="fixed bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 z-40" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-100/20 rounded-full blur-3xl" />
      </div>


      <div className="fixed top-3 right-4 z-50 flex items-center gap-2">
        {players.length < 4 && players.length >= 2 && (
          <button
            onClick={() => setAddDialogOpen(true)}
            className="p-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-200 text-red-600 hover:text-red-700 transition-all cursor-pointer"
            title="Tambah tim"
          >
            <UserPlus className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-200 text-red-600 hover:text-red-700 transition-all cursor-pointer"
          id="btn-fullscreen"
          title={isFullscreen ? "Keluar fullscreen" : "Mode fullscreen"}
        >
          {isFullscreen ? (
            <Minimize className="w-5 h-5" />
          ) : (
            <Maximize className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-5 md:py-8">
        <header className="text-center mb-6 md:mb-8">
          <div className="inline-flex flex-col items-center gap-1 mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-[0.6rem] md:text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full shadow-lg shadow-red-300/30">
                DIRGAHAYU REPUBLIK INDONESIA KE-81
              </div>
            </div>
            <p className="text-red-400 text-[0.6rem] font-semibold tracking-[0.3em] uppercase">
              17 Agustus 2026
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 mb-1">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-10 h-10 md:w-14 md:h-14 object-contain drop-shadow-md"
            />
          </div>
          <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-red-700 via-red-600 to-red-700 bg-clip-text text-transparent tracking-tight">
            Turnamen Badminton
          </h1>
          <p className="text-red-500/60 text-xs md:text-sm font-bold tracking-widest uppercase">
            PT LPP Agro Nusantara
          </p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-300" />
            <span className="text-amber-500 text-sm">★</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-300" />
          </div>
        </header>

        {players.length === 0 && (
          <EmptyState onAddTeam={() => setAddDialogOpen(true)} />
        )}
        {players.length === 1 && (
          <SingleTeamState
            player={players[0]}
            photos={photos}
            onAddTeam={() => setAddDialogOpen(true)}
            onEditName={(p) => setEditNamePlayer(p)}
            onEditPhoto={(tid, ai) =>
              setEditPhoto({ teamId: tid, athleteIndex: ai })
            }
          />
        )}
        {players.length === 2 && (
          <FootballScoreboard
            players={players}
            photos={photos}
            highestScore={highestScore}
            hasWinner={hasWinner}
            animatingId={animatingId}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onEditName={(p) => setEditNamePlayer(p)}
            onEditPhoto={(tid, ai) =>
              setEditPhoto({ teamId: tid, athleteIndex: ai })
            }
          />
        )}
        {players.length > 2 && (
          <MultiTeamGrid
            players={players}
            photos={photos}
            highestScore={highestScore}
            hasWinner={hasWinner}
            animatingId={animatingId}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onRemove={removePlayer}
            onEditName={(p) => setEditNamePlayer(p)}
            onEditPhoto={(tid, ai) =>
              setEditPhoto({ teamId: tid, athleteIndex: ai })
            }
          />
        )}

        {players.length >= 2 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Button
              onClick={resetAll}
              variant="outline"
              className="bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 rounded-xl px-5 cursor-pointer shadow-sm text-sm"
              id="btn-reset-all"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" /> Reset Skor
            </Button>
            <Button
              onClick={clearStorage}
              variant="outline"
              className="bg-white hover:bg-red-50 text-red-500 border-red-200 hover:border-red-400 rounded-xl px-5 cursor-pointer shadow-sm text-sm"
              id="btn-clear-storage"
            >
              <Trash2 className="w-4 h-4 mr-1.5" /> Hapus Semua Tim
            </Button>
          </div>
        )}

        <footer className="text-center mt-8 text-red-300 text-[0.65rem] space-y-0.5">
          <p>Data tersimpan otomatis di browser • Maksimal 4 tim</p>
          <p className="text-red-300/70 font-semibold tracking-wider">
            MERDEKA!
          </p>
        </footer>
      </div>

      {/* Dialogs */}
      <AddTeamDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={addPlayer}
        teamCount={players.length}
      />
      <EditNameDialog
        open={!!editNamePlayer}
        onOpenChange={(o) => {
          if (!o) setEditNamePlayer(null);
        }}
        player={editNamePlayer}
        onSave={saveName}
      />
      <EditPhotoDialog
        open={!!editPhoto}
        onOpenChange={(o) => {
          if (!o) setEditPhoto(null);
        }}
        teamId={editPhoto?.teamId}
        athleteIndex={editPhoto?.athleteIndex ?? 0}
        currentPhoto={editPhotoCurrentPhoto}
        onSave={savePhoto}
      />
    </div>
  );
}

export default App;
