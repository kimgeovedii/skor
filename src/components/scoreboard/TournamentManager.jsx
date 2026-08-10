import { useState, useRef } from "react";
import { Save, X, Trophy, Upload, Image as ImageIcon, Plus, List, Trash2, CheckCircle2, Eye, Pencil } from "lucide-react";
import { THEMES } from "@/hooks/useTournamentManager";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";

export function TournamentManager({ tournaments, onLoad, onCreate, onUpdate, onClearAll, onCancel }) {
  const [view, setView] = useState(tournaments.length > 0 ? "list" : "create");
  const [formData, setFormData] = useState({
    tournamentName: "",
    organizer: "",
    eventName: "",
    eventDate: "",
    sportType: "badminton",
    tournamentLogo: "",
    theme: "red", // default theme
    voiceLanguage: "id", // default voice
  });
  const [confirmClear, setConfirmClear] = useState(false);
  const [previewConfig, setPreviewConfig] = useState(null);
  const [editId, setEditId] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Maksimal 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, tournamentLogo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, tournamentLogo: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      onUpdate(editId, formData);
    } else {
      onCreate(formData);
    }
  };

  const handleEdit = (t) => {
    setEditId(t.id);
    setFormData({
      tournamentName: t.tournamentName,
      organizer: t.organizer,
      eventName: t.eventName,
      eventDate: t.eventDate,
      sportType: t.sportType,
      tournamentLogo: t.tournamentLogo,
      theme: t.theme,
      voiceLanguage: t.voiceLanguage || "id",
    });
    setView("create");
  };

  const handleCreateNew = () => {
    setEditId(null);
    setFormData({
      tournamentName: "",
      organizer: "",
      eventName: "",
      eventDate: "",
      sportType: "badminton",
      tournamentLogo: "",
      theme: "red",
      voiceLanguage: "id",
    });
    setView("create");
  };

  const handleClear = () => {
    setConfirmClear(true);
  };

  const executeClear = () => {
    setConfirmClear(false);
    onClearAll();
    handleCreateNew();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 mb-10">
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/5 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
        
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Tournament Manager</h2>
            </div>
            
            <div className="flex items-center gap-2">
              {tournaments.length > 0 && (
                <button
                  onClick={() => setView("list")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
                    view === "list" ? "bg-white/20 text-white" : "bg-transparent text-white/50 hover:bg-white/5"
                  }`}
                >
                  <List className="w-4 h-4" /> Daftar Turnamen
                </button>
              )}
              <button
                onClick={handleCreateNew}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
                  view === "create" ? "bg-white/20 text-white" : "bg-transparent text-white/50 hover:bg-white/5"
                }`}
              >
                <Plus className="w-4 h-4" /> Bikin Baru
              </button>
              <button onClick={onCancel} className="ml-2 text-white/40 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {view === "list" && (
            <div className="space-y-4">
              <p className="text-sm text-white/60 mb-4">Pilih turnamen yang sudah pernah Anda buat sebelumnya:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tournaments.map((t) => (
                  <div key={t.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group">
                    <button
                      onClick={() => onLoad(t.id)}
                      className="flex-1 flex items-center gap-4 text-left"
                    >
                      <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center overflow-hidden shrink-0">
                        {t.tournamentLogo ? (
                          <img src={t.tournamentLogo} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                          <Trophy className="w-5 h-5 text-white/20" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white mb-1 group-hover:text-red-400 transition-colors">{t.tournamentName}</h3>
                        <p className="text-xs text-white/40">{t.eventName}</p>
                        <p className="text-[10px] text-white/30 mt-1">Dibuat: {new Date(t.createdAt).toLocaleDateString("id-ID")}</p>
                      </div>
                    </button>
                    <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-auto border-t border-white/10 sm:border-t-0 sm:border-l sm:pl-3 pt-3 sm:pt-0 mt-3 sm:mt-0 w-full sm:w-auto">
                      <Button variant="ghost" size="sm" onClick={() => setPreviewConfig(t)} className="h-8 text-white/60 hover:text-white hover:bg-white/10 flex-1 sm:flex-none">
                        <Eye className="w-4 h-4 mr-2" /> Preview
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(t)} className="h-8 text-white/60 hover:text-white hover:bg-white/10 flex-1 sm:flex-none">
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-bold px-4 py-2 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Clear All Data
                </button>
              </div>
            </div>
          )}

          {view === "create" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                    Nama Turnamen
                  </label>
                  <input
                    type="text"
                    name="tournamentName"
                    value={formData.tournamentName}
                    onChange={handleChange}
                    placeholder="Contoh: Turnamen Badminton"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                    Nama Penyelenggara
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    placeholder="Contoh: PT LPP Agro Nusantara"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                    Nama Event
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Contoh: HUT RI KE-81"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                    Tanggal Event
                  </label>
                  <input
                    type="text"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    placeholder="Contoh: 17 Agustus 2026"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Logo Upload Section */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                  Logo Turnamen (Opsional)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {formData.tournamentLogo ? (
                      <img src={formData.tournamentLogo} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-white/20" />
                    )}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-sm px-4 py-2 rounded-xl border border-white/10 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" /> Pilih Logo
                    </button>
                    {formData.tournamentLogo && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="text-xs font-bold text-red-400 hover:text-red-300 px-3 py-2 cursor-pointer bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Theme & Voice Selection */}
              <div className="pt-2 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-3 mt-4">
                    Tema Warna Papan Skor
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {THEMES.map((theme) => {
                      const isSelected = formData.theme === theme.id;
                      return (
                        <button
                          type="button"
                          key={theme.id}
                          onClick={() => setFormData((prev) => ({ ...prev, theme: theme.id }))}
                          className={`relative p-3 rounded-xl border transition-all ${
                            isSelected ? "bg-white/10 border-white/50 ring-2 ring-white/20" : "bg-black/30 border-white/5 hover:bg-white/5"
                          }`}
                        >
                          <div className={`w-full h-4 rounded-lg bg-gradient-to-br ${theme.bg} mb-2 shadow-inner border border-black/10`} />
                          <span className="text-[10px] font-bold block text-white/80">{theme.name}</span>
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-3 mt-4">
                    Bahasa Voice Over
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, voiceLanguage: "id" }))}
                      className={`relative p-4 rounded-xl border transition-all ${
                        formData.voiceLanguage === "id" ? "bg-white/10 border-red-500 ring-2 ring-red-500/20" : "bg-black/30 border-white/5 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-sm font-bold block text-white">🇮🇩 Indonesia</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, voiceLanguage: "en" }))}
                      className={`relative p-4 rounded-xl border transition-all ${
                        formData.voiceLanguage === "en" ? "bg-white/10 border-blue-500 ring-2 ring-blue-500/20" : "bg-black/30 border-white/5 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-sm font-bold block text-white">🇬🇧 English</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-end gap-3 mt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 rounded-xl font-bold text-white/60 hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  {editId ? "Simpan Perubahan" : "Buat Turnamen"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Clear Confirmation Dialog */}
      <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Hapus Semua Data?
            </DialogTitle>
            <DialogDescription>
              PERINGATAN: Semua data turnamen, skor pertandingan, dan foto atlet akan dihapus permanen dari browser Anda. Aksi ini tidak dapat dibatalkan. Yakin ingin melanjutkan?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setConfirmClear(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={executeClear}>
              Ya, Hapus Semua
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewConfig} onOpenChange={(open) => !open && setPreviewConfig(null)}>
        <DialogContent className="sm:max-w-4xl bg-[#0f172a] border-slate-800 p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-white/10 bg-black/40">
            <DialogTitle className="text-white">Preview Layout Scoreboard</DialogTitle>
          </DialogHeader>
          
          <div className="relative w-full h-[500px] overflow-hidden flex items-center justify-center">
            {/* Background Theme Area */}
            {previewConfig && (() => {
              const themeData = THEMES.find(t => t.id === previewConfig.theme) || THEMES[0];
              return (
                <div className={`absolute inset-0 bg-gradient-to-br ${themeData.bg} opacity-20`} />
              );
            })()}
            
            {/* Safe Area */}
            <div className="relative z-10 w-full max-w-4xl px-8 transform scale-90">
              {previewConfig && <Header config={previewConfig} />}
              <div className="mt-8 flex justify-center gap-12 opacity-80">
                <div className="w-64 h-48 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center text-white/50 text-xl font-black uppercase tracking-widest">Team A</div>
                <div className="w-64 h-48 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center text-white/50 text-xl font-black uppercase tracking-widest">Team B</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
