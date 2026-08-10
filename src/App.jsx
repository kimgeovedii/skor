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
} from "lucide-react";

const STORAGE_KEY = "skor-turnamen-badminton";
const PHOTOS_KEY = "skor-turnamen-photos";
const SOUND_INCREMENT = "/audio/ssstik.io_1786355463088.mp3";
const SOUND_DECREMENT = "/audio/fahhhhhhhhhhhhhh.mp3";

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
    } catch {
      // ignore quota
    }
  }, [key, value]);

  return [value, setValue];
}

/* ──── Resize image helper ──── */
function resizeImage(file, maxSize = 200) {
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
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ──── Background removal (client-side) ──── */
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
          const maxSize = 200;
          let { width, height } = img;
          if (width > height) {
            if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
          } else {
            if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/png", 0.8));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("BG removal failed, using original:", err);
    return resizeImage(file);
  }
}

/* ──── Athlete Photo Display ──── */
function AthletePhotos({ photos, size = "md" }) {
  if (!photos || photos.length === 0) return null;
  const sizes = { sm: "w-10 h-10", md: "w-14 h-14 md:w-16 md:h-16", lg: "w-16 h-16 md:w-20 md:h-20" };
  return (
    <div className="flex items-center justify-center -space-x-3 mb-2">
      {photos.map((photo, i) => (
        <div key={i} className={`${sizes[size]} rounded-full overflow-hidden border-2 border-white/20 bg-white/10 shadow-lg`}>
          <img src={photo} alt={`Atlet ${i + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}

/* ──── Photo Upload Slot ──── */
function PhotoUploadSlot({ index, photo, onUpload, processing }) {
  const inputRef = useRef(null);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <label className="text-xs font-semibold text-gray-500">Atlet {index + 1}</label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={processing}
        className="relative w-20 h-20 rounded-2xl border-2 border-dashed border-red-200 hover:border-red-400 bg-red-50/50 flex items-center justify-center transition-all cursor-pointer overflow-hidden disabled:opacity-50 disabled:cursor-wait group"
      >
        {processing ? (
          <div className="flex flex-col items-center gap-1">
            <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
            <span className="text-[0.55rem] text-red-400">Proses...</span>
          </div>
        ) : photo ? (
          <>
            <img src={photo} alt={`Atlet ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-red-300">
            <Upload className="w-5 h-5" />
            <span className="text-[0.55rem]">Upload</span>
          </div>
        )}
      </button>
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

/* ──── Score pop animation ──── */
function ScorePop({ active }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
      <div className="w-full h-full rounded-2xl border-2 border-amber-400/60 animate-[ping_0.6s_ease-out_1]" />
    </div>
  );
}

/* ══════════════════════════════════════════════
   EMPTY STATE
   ══════════════════════════════════════════════ */
function EmptyState({ onAddTeam }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-white/5 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
        <div className="px-8 py-16 md:py-20 text-center">
          <div className="text-6xl mb-4">🏸</div>
          <h2 className="text-white/80 text-lg md:text-xl font-bold mb-2">Belum Ada Tim</h2>
          <p className="text-white/40 text-sm mb-6">Tambahkan minimal 2 tim untuk memulai pertandingan</p>
          <button onClick={onAddTeam} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer">
            <UserPlus className="w-5 h-5" />
            Tambah Tim
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SINGLE TEAM STATE
   ══════════════════════════════════════════════ */
function SingleTeamState({ player, photos, onAddTeam }) {
  const teamPhotos = photos[player.id] || [];
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-white/5 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
        <div className="px-8 py-12 md:py-16 text-center">
          <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-4">Tim Terdaftar</p>
          {teamPhotos.length > 0 && <AthletePhotos photos={teamPhotos} size="lg" />}
          <h2 className="text-white text-2xl md:text-3xl font-black tracking-wider uppercase mb-6">{player.name}</h2>
          <p className="text-white/40 text-sm mb-6">Tambahkan 1 tim lagi untuk memulai</p>
          <button onClick={onAddTeam} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer">
            <UserPlus className="w-5 h-5" />
            Tambah Tim Lawan
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FOOTBALL SCOREBOARD (2 players)
   ══════════════════════════════════════════════ */
function FootballScoreboard({ players, photos, highestScore, hasWinner, animatingId, onIncrement, onDecrement }) {
  const teamA = players[0];
  const teamB = players[1];
  const photosA = photos[teamA.id] || [];
  const photosB = photos[teamB.id] || [];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-white/5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
        <div className="relative px-4 md:px-8 py-6 md:py-8">
          <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-[0.6rem] md:text-xs font-bold tracking-[0.3em] text-amber-400/80 uppercase">Badminton Match</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="flex items-center justify-between gap-2 md:gap-4">
            {/* Team A */}
            <div className="flex-1 flex flex-col items-center">
              {photosA.length > 0 && <AthletePhotos photos={photosA} size="md" />}
              <h2 className="text-white/90 text-sm md:text-xl font-extrabold tracking-wider uppercase truncate max-w-full">{teamA.name}</h2>
            </div>

            {/* Scores */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <div className="relative">
                <ScorePop active={animatingId === teamA.id} />
                <div className={`w-20 h-24 md:w-32 md:h-40 lg:w-36 lg:h-44 flex items-center justify-center bg-gradient-to-b from-white/15 to-white/5 rounded-2xl border border-white/10 ${hasWinner && teamA.score === highestScore && teamA.score > 0 ? "ring-2 ring-amber-400/50" : ""} transition-all duration-300`}>
                  <span className={`text-5xl md:text-8xl lg:text-9xl font-black tabular-nums text-white transition-transform duration-200 ${animatingId === teamA.id ? "scale-110" : "scale-100"}`} style={{ textShadow: "0 0 30px rgba(255,255,255,0.15)" }}>
                    {teamA.score}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-6 md:h-10 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <span className="text-amber-400/70 text-xs md:text-sm font-black tracking-widest">VS</span>
                <div className="w-px h-6 md:h-10 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              </div>

              <div className="relative">
                <ScorePop active={animatingId === teamB.id} />
                <div className={`w-20 h-24 md:w-32 md:h-40 lg:w-36 lg:h-44 flex items-center justify-center bg-gradient-to-b from-white/15 to-white/5 rounded-2xl border border-white/10 ${hasWinner && teamB.score === highestScore && teamB.score > 0 ? "ring-2 ring-amber-400/50" : ""} transition-all duration-300`}>
                  <span className={`text-5xl md:text-8xl lg:text-9xl font-black tabular-nums text-white transition-transform duration-200 ${animatingId === teamB.id ? "scale-110" : "scale-100"}`} style={{ textShadow: "0 0 30px rgba(255,255,255,0.15)" }}>
                    {teamB.score}
                  </span>
                </div>
              </div>
            </div>

            {/* Team B */}
            <div className="flex-1 flex flex-col items-center">
              {photosB.length > 0 && <AthletePhotos photos={photosB} size="md" />}
              <h2 className="text-white/90 text-sm md:text-xl font-extrabold tracking-wider uppercase truncate max-w-full">{teamB.name}</h2>
            </div>
          </div>

          {hasWinner && (
            <div className="flex items-center justify-center mt-4 md:mt-6">
              <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1.5">
                <span className="text-lg">🏸</span>
                <span className="text-amber-400 text-xs font-bold tracking-wider uppercase">
                  {players.find((p) => p.score === highestScore)?.name} Unggul
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
      </div>

      {/* Controls */}
      <div className="flex items-stretch justify-between gap-4 mt-5 px-2 md:px-8">
        <div className="flex-1 flex items-center justify-center gap-3">
          <button onClick={() => onDecrement(teamA.id)} className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer" id="btn-decrement-a">
            <Minus className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase hidden sm:block">{teamA.name}</span>
          <button onClick={() => onIncrement(teamA.id)} className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer" id="btn-increment-a">
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center gap-3">
          <button onClick={() => onDecrement(teamB.id)} className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer" id="btn-decrement-b">
            <Minus className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase hidden sm:block">{teamB.name}</span>
          <button onClick={() => onIncrement(teamB.id)} className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer" id="btn-increment-b">
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MULTI-TEAM GRID (3-4 players)
   ══════════════════════════════════════════════ */
function MultiTeamGrid({ players, photos, highestScore, hasWinner, animatingId, onIncrement, onDecrement, onRemove }) {
  const cardColors = ["from-red-700 to-red-800", "from-slate-700 to-slate-800", "from-amber-600 to-amber-700", "from-blue-700 to-blue-800"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 w-full max-w-4xl mx-auto">
      {players.map((player, idx) => {
        const teamPhotos = photos[player.id] || [];
        return (
          <div key={player.id} className="relative group">
            <button onClick={() => onRemove(player.id)} className="absolute -top-2 -right-2 z-20 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg" title="Hapus tim">✕</button>
            <div className={`relative bg-gradient-to-br ${cardColors[idx % cardColors.length]} rounded-2xl overflow-hidden shadow-xl border border-white/10`}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400/50 via-white/20 to-amber-400/50" />
              <div className="p-4 md:p-6 text-center">
                {hasWinner && player.score === highestScore && player.score > 0 && (
                  <div className="mb-1 animate-bounce"><span className="text-2xl">🏸</span></div>
                )}
                {teamPhotos.length > 0 && <AthletePhotos photos={teamPhotos} size="sm" />}
                <h3 className="text-white/80 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-2">{player.name}</h3>
                <div className="relative">
                  <ScorePop active={animatingId === player.id} />
                  <span className={`text-5xl md:text-7xl font-black tabular-nums text-white transition-transform duration-200 ${animatingId === player.id ? "scale-110" : "scale-100"}`} style={{ textShadow: "0 0 20px rgba(255,255,255,0.1)" }}>
                    {player.score}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 mt-3">
              <button onClick={() => onDecrement(player.id)} className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer">
                <Minus className="w-5 h-5" />
              </button>
              <button onClick={() => onIncrement(player.id)} className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ADD TEAM DIALOG
   ══════════════════════════════════════════════ */
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
      const result = await processBackgroundRemoval(file);
      setPhoto(result);
    } catch {
      const resized = await resizeImage(file);
      setPhoto(resized);
    }
    setProcessing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const teamPhotos = [photo1, photo2].filter(Boolean);
    onAdd(name.trim(), teamPhotos);
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
            <UserPlus className="w-5 h-5" />
            Tambah Tim Baru
          </DialogTitle>
          <DialogDescription>
            Masukkan nama tim dan foto 2 atlet. Background foto akan dihapus otomatis. Sisa slot: <strong className="text-red-600">{remaining}</strong>
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
              Foto Atlet <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <div className="flex items-center justify-center gap-6">
              <PhotoUploadSlot index={0} photo={photo1} processing={processing1} onUpload={(file) => handlePhoto(file, setPhoto1, setProcessing1)} />
              <PhotoUploadSlot index={1} photo={photo2} processing={processing2} onUpload={(file) => handlePhoto(file, setPhoto2, setProcessing2)} />
            </div>
            {isProcessing && (
              <p className="text-xs text-amber-600 mt-2 text-center flex items-center justify-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                Menghapus background foto... (proses pertama lebih lama)
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <DialogClose>
              <Button type="button" variant="outline" className="rounded-xl border-gray-200 cursor-pointer">Batal</Button>
            </DialogClose>
            <Button type="submit" disabled={!name.trim() || isProcessing} className="bg-red-600 hover:bg-red-500 text-white rounded-xl px-6 cursor-pointer disabled:opacity-30 shadow-md shadow-red-200">
              {isProcessing ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Plus className="w-4 h-4 mr-1.5" />}
              Tambah
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ══════════════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════════════ */
function App() {
  const [players, setPlayers] = useLocalStorage(STORAGE_KEY, []);
  const [photos, setPhotos] = useLocalStorage(PHOTOS_KEY, {});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animatingId, setAnimatingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const audioIncRef = useRef(null);
  const audioDecRef = useRef(null);

  const colorCycle = ["red", "white", "gold", "blue"];

  useEffect(() => {
    audioIncRef.current = new Audio(SOUND_INCREMENT);
    audioIncRef.current.volume = 0.5;
    audioDecRef.current = new Audio(SOUND_DECREMENT);
    audioDecRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const playSound = useCallback((type) => {
    try {
      const audio = type === "increment" ? audioIncRef.current : audioDecRef.current;
      if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
    } catch { /* ignore */ }
  }, []);

  const triggerAnimation = useCallback((id) => {
    setAnimatingId(id);
    setTimeout(() => setAnimatingId(null), 600);
  }, []);

  const handleIncrement = useCallback((id) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, score: p.score + 1 } : p)));
    playSound("increment");
    triggerAnimation(id);
  }, [playSound, triggerAnimation, setPlayers]);

  const handleDecrement = useCallback((id) => {
    const player = players.find((p) => p.id === id);
    if (player && player.score <= 0) return;
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, score: Math.max(0, p.score - 1) } : p)));
    playSound("decrement");
    triggerAnimation(id);
  }, [playSound, triggerAnimation, setPlayers, players]);

  const resetAll = useCallback(() => {
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
  }, [setPlayers]);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PHOTOS_KEY);
    setPlayers([]);
    setPhotos({});
  }, [setPlayers, setPhotos]);

  const addPlayer = useCallback((name, playerPhotos = []) => {
    if (players.length >= 4) return;
    const id = Date.now();
    setPlayers((prev) => [...prev, { id, name, score: 0, color: colorCycle[prev.length % colorCycle.length] }]);
    if (playerPhotos.length > 0) {
      setPhotos((prev) => ({ ...prev, [id]: playerPhotos }));
    }
    if (players.length + 1 >= 2) {
      setDialogOpen(false);
    }
  }, [players.length, setPlayers, setPhotos]);

  const removePlayer = useCallback((id) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setPhotos((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, [setPlayers, setPhotos]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const highestScore = Math.max(...players.map((p) => p.score), 0);
  const hasWinner = highestScore > 0 && players.length >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50 text-gray-900 overflow-hidden relative">
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 z-40" />
      <div className="fixed bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 z-40" />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      <div className="fixed top-2 left-4 text-2xl opacity-15 pointer-events-none z-30">🇮🇩</div>
      <div className="fixed top-2 right-14 text-2xl opacity-15 pointer-events-none z-30">🇮🇩</div>

      <div className="fixed top-3 right-4 z-50 flex items-center gap-2">
        {players.length < 4 && players.length >= 2 && (
          <button onClick={() => setDialogOpen(true)} className="p-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-200 text-red-600 hover:text-red-700 transition-all cursor-pointer" title="Tambah tim">
            <UserPlus className="w-5 h-5" />
          </button>
        )}
        <button onClick={toggleFullscreen} className="p-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-200 text-red-600 hover:text-red-700 transition-all cursor-pointer" id="btn-fullscreen" title={isFullscreen ? "Keluar fullscreen" : "Mode fullscreen"}>
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-5 md:py-8">
        <header className="text-center mb-6 md:mb-8">
          <div className="inline-flex flex-col items-center gap-1 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl">🇮🇩</span>
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-[0.6rem] md:text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full shadow-lg shadow-red-300/30">
                DIRGAHAYU REPUBLIK INDONESIA KE-81
              </div>
              <span className="text-2xl md:text-3xl">🇮🇩</span>
            </div>
            <p className="text-red-400 text-[0.6rem] font-semibold tracking-[0.3em] uppercase">17 Agustus 2026</p>
          </div>
          <div className="flex items-center justify-center gap-3 mb-1">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain drop-shadow-md" />
          </div>
          <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-red-700 via-red-600 to-red-700 bg-clip-text text-transparent tracking-tight">Turnamen Badminton</h1>
          <p className="text-red-500/60 text-xs md:text-sm font-bold tracking-widest uppercase">PT LPP Agro Nusantara</p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-300" />
            <span className="text-amber-500 text-sm">★</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-300" />
          </div>
        </header>

        {players.length === 0 && <EmptyState onAddTeam={() => setDialogOpen(true)} />}
        {players.length === 1 && <SingleTeamState player={players[0]} photos={photos} onAddTeam={() => setDialogOpen(true)} />}
        {players.length === 2 && (
          <FootballScoreboard players={players} photos={photos} highestScore={highestScore} hasWinner={hasWinner} animatingId={animatingId} onIncrement={handleIncrement} onDecrement={handleDecrement} />
        )}
        {players.length > 2 && (
          <MultiTeamGrid players={players} photos={photos} highestScore={highestScore} hasWinner={hasWinner} animatingId={animatingId} onIncrement={handleIncrement} onDecrement={handleDecrement} onRemove={removePlayer} />
        )}

        {players.length >= 2 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Button onClick={resetAll} variant="outline" className="bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 rounded-xl px-5 cursor-pointer shadow-sm text-sm" id="btn-reset-all">
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset Skor
            </Button>
            <Button onClick={clearStorage} variant="outline" className="bg-white hover:bg-red-50 text-red-500 border-red-200 hover:border-red-400 rounded-xl px-5 cursor-pointer shadow-sm text-sm" id="btn-clear-storage">
              <Trash2 className="w-4 h-4 mr-1.5" />
              Hapus Semua Tim
            </Button>
          </div>
        )}

        <footer className="text-center mt-8 text-red-300 text-[0.65rem] space-y-0.5">
          <p>Data tersimpan otomatis di browser • Maksimal 4 tim</p>
          <p className="text-red-300/70 font-semibold tracking-wider">MERDEKA! 🇮🇩</p>
        </footer>
      </div>

      <AddTeamDialog open={dialogOpen} onOpenChange={setDialogOpen} onAdd={addPlayer} teamCount={players.length} />
    </div>
  );
}

export default App;
