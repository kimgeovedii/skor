import { Camera, Plus } from "lucide-react";

const SIZE_MAP = {
  sm: "w-14 h-14",
  md: "w-20 h-20 md:w-24 md:h-24",
  lg: "w-24 h-24 md:w-32 md:h-32",
};

/**
 * Displays athlete photos with click-to-edit functionality.
 * Shows placeholders when no photos are available.
 */
export function AthletePhotos({ photos, size = "md", onClickPhoto }) {
  if (!photos || photos.length === 0) {
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

  const sizeClass = SIZE_MAP[size];

  return (
    <div className="flex items-center justify-center -space-x-4 mb-2">
      {photos.map((photo, i) => (
        <button
          key={i}
          onClick={() => onClickPhoto?.(i)}
          className={`${sizeClass} rounded-full overflow-hidden border-3 border-white/25 bg-white/10 shadow-xl ring-1 ring-black/5 cursor-pointer hover:ring-2 hover:ring-amber-400/50 hover:scale-110 transition-all group relative`}
          title={`Klik untuk ganti foto atlet ${i + 1}`}
        >
          <img src={photo} alt={`Atlet ${i + 1}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </button>
      ))}
      {photos.length === 1 && onClickPhoto && (
        <button
          onClick={() => onClickPhoto(1)}
          className={`${sizeClass} rounded-full border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center cursor-pointer hover:border-amber-400/50 hover:bg-white/10 transition-all group`}
          title="Tambah foto atlet 2"
        >
          <Plus className="w-5 h-5 text-white/30 group-hover:text-amber-400/60 transition-colors" />
        </button>
      )}
    </div>
  );
}
