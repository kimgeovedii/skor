import { useRef } from "react";
import { Upload, Loader2, Camera } from "lucide-react";

/**
 * Photo upload slot used in dialogs for individual athlete photo management.
 */
export function PhotoUploadSlot({ index, photo, onUpload, processing, onRemovePhoto }) {
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
            <img src={photo} alt={`Atlet ${index + 1}`} className="w-full h-full object-cover" />
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
