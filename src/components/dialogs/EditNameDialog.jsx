import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog";

/**
 * Dialog for editing a team's name.
 */
export function EditNameDialog({ open, onOpenChange, player, onSave }) {
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
              <Button type="button" variant="outline" className="rounded-xl border-gray-200 cursor-pointer">Batal</Button>
            </DialogClose>
            <Button
              type="submit" disabled={!name.trim()}
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
