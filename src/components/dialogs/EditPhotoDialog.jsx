import { useState, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { PhotoUploadSlot } from "@/components/shared/PhotoUploadSlot";
import { processPhoto } from "@/services/imageService";

/**
 * Dialog for uploading/replacing a single athlete's photo.
 */
export function EditPhotoDialog({ open, onOpenChange, teamId, athleteIndex, currentPhoto, onSave }) {
  const [photo, setPhoto] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (open) setPhoto(currentPhoto || null);
  }, [open, currentPhoto]);

  const handleUpload = async (file) => {
    setProcessing(true);
    setPhoto(await processPhoto(file));
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
            index={athleteIndex} photo={photo} processing={processing}
            onUpload={handleUpload} onRemovePhoto={() => setPhoto(null)}
          />
          {processing && (
            <p className="text-xs text-amber-600 flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" /> Menghapus background...
            </p>
          )}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose>
            <Button type="button" variant="outline" className="rounded-xl border-gray-200 cursor-pointer">Batal</Button>
          </DialogClose>
          <Button
            onClick={handleSave} disabled={processing}
            className="bg-red-600 hover:bg-red-500 text-white rounded-xl px-6 cursor-pointer disabled:opacity-30 shadow-md shadow-red-200"
          >
            {processing ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Camera className="w-4 h-4 mr-1.5" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
