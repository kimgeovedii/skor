import { useLocalStorage } from "./useLocalStorage";

const LIST_KEY = "skor-tournaments-list-v1";
const ACTIVE_KEY = "skor-active-tournament-v1";

export const THEMES = [
  { id: "red", name: "Merah Merona (Default)", bg: "from-red-50 via-white to-red-50", text: "text-red-700", border: "from-red-600 via-red-500 to-red-600" },
  { id: "blue", name: "Biru Samudra", bg: "from-blue-50 via-white to-blue-50", text: "text-blue-700", border: "from-blue-600 via-blue-500 to-blue-600" },
  { id: "emerald", name: "Hijau Zamrud", bg: "from-emerald-50 via-white to-emerald-50", text: "text-emerald-700", border: "from-emerald-600 via-emerald-500 to-emerald-600" },
  { id: "purple", name: "Ungu Gelap", bg: "from-purple-50 via-white to-purple-50", text: "text-purple-700", border: "from-purple-600 via-purple-500 to-purple-600" },
  { id: "slate", name: "Abu-abu Minimalis", bg: "from-slate-50 via-white to-slate-50", text: "text-slate-700", border: "from-slate-600 via-slate-500 to-slate-600" },
];

export function useTournamentManager() {
  const [tournaments, setTournaments] = useLocalStorage(LIST_KEY, []);
  const [activeId, setActiveId] = useLocalStorage(ACTIVE_KEY, null);

  const activeTournament = tournaments.find((t) => t.id === activeId) || null;

  const createTournament = (tournamentData) => {
    const newTournament = {
      ...tournamentData,
      voiceLanguage: tournamentData.voiceLanguage || "id",
      id: crypto.randomUUID(), // Unique ID for each tournament
      createdAt: new Date().toISOString(),
    };
    setTournaments((prev) => [...prev, newTournament]);
    setActiveId(newTournament.id);
    return newTournament;
  };

  const loadTournament = (id) => {
    setActiveId(id);
  };

  const updateActiveTournament = (updates) => {
    if (!activeId) return;
    setTournaments((prev) =>
      prev.map((t) => (t.id === activeId ? { ...t, ...updates } : t))
    );
  };

  const updateTournament = (id, updates) => {
    setTournaments((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTournament = (id) => {
    setTournaments((prev) => prev.filter((t) => t.id !== id));
    if (activeId === id) {
      setActiveId(null);
    }
    // Cleanup local storage keys associated with this tournament
    localStorage.removeItem(`skor-turnamen-badminton-v2-${id}`);
    localStorage.removeItem(`skor-turnamen-photos-${id}`);
  };

  const clearAllData = () => {
    // 1. Find all keys related to the app
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("skor-")) {
        keysToRemove.push(key);
      }
    }
    
    // 2. Remove them all
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // 3. Reset state
    setTournaments([]);
    setActiveId(null);
  };

  return {
    tournaments,
    activeId,
    activeTournament,
    createTournament,
    loadTournament,
    updateActiveTournament,
    updateTournament,
    deleteTournament,
    clearAllData,
  };
}
