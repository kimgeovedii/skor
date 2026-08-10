import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Hooks
import { useScoreboard } from "@/hooks/useScoreboard";
import { useTournamentManager, THEMES } from "@/hooks/useTournamentManager";

// Layout
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";

// Scoreboard views
import { TournamentManager } from "@/components/scoreboard/TournamentManager";
import { MatchSetup } from "@/components/scoreboard/MatchSetup";
import { BadmintonScoreboard } from "@/components/scoreboard/FootballScoreboard";

// Shared
import { ScoreBumper } from "@/components/shared/ScoreBumper";

// Dialogs
import { EditNameDialog } from "@/components/dialogs/EditNameDialog";
import { EditPhotoDialog } from "@/components/dialogs/EditPhotoDialog";

export function MatchPage() {
  const navigate = useNavigate();
  const { 
    tournaments, 
    activeId, 
    activeTournament, 
    loadTournament, 
    createTournament, 
    updateTournament,
    clearAllData 
  } = useTournamentManager();

  const [showManager, setShowManager] = useState(!activeId);

  // Sync manager visibility with activeId
  useEffect(() => {
    if (!activeId) setShowManager(true);
  }, [activeId]);

  const handleCreate = (data) => {
    createTournament(data);
    setShowManager(false);
  };

  const handleUpdate = (id, data) => {
    updateTournament(id, data);
    setShowManager(false);
  };

  const handleLoad = (id) => {
    loadTournament(id);
    setShowManager(false);
  };

  const handleClear = () => {
    clearAllData();
    setShowManager(true);
  };

  const handleCancelManager = () => {
    if (!activeId) {
      navigate("/");
    } else {
      setShowManager(false);
    }
  };

  // Resolve theme
  const themeObj = THEMES.find(t => t.id === activeTournament?.theme) || THEMES[0];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${themeObj.bg} text-gray-900 overflow-hidden relative transition-colors duration-500`}>
      {/* Decorative borders */}
      <div className={`fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${themeObj.border} z-40 transition-colors duration-500`} />
      <div className={`fixed bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${themeObj.border} z-40 transition-colors duration-500`} />

      {showManager ? (
        <div className="relative z-10 pt-10">
          <TournamentManager 
            tournaments={tournaments}
            onLoad={handleLoad}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onClearAll={handleClear}
            onCancel={activeId ? handleCancelManager : undefined}
          />
        </div>
      ) : (
        activeId && <MatchContainer key={activeId} config={activeTournament} theme={themeObj} onOpenManager={() => setShowManager(true)} />
      )}
    </div>
  );
}

// Inner container that manages the specific match state for the active tournament
// React's `key` prop ensures this completely remounts if activeId changes, resetting the hooks correctly.
function MatchContainer({ config, theme, onOpenManager }) {
  // Sync voice language
  useEffect(() => {
    import("@/services/voiceService").then(v => v.setVoiceLanguage(config.voiceLanguage || "id"));
  }, [config.voiceLanguage]);

  const {
    match, photos, animatingTeam, bumper,
    currentSet, currentAnalysis, isOnBreak,
    addPoint, undoPoint, startSet,
    setupMatch, resetMatch, newMatch,
    saveTeamName, savePhoto,
  } = useScoreboard(config.id);

  const [showSetup, setShowSetup] = useState(!match.isStarted);
  const [editNameData, setEditNameData] = useState(null);
  const [editPhotoData, setEditPhotoData] = useState(null);

  const handleStartMatch = (teamA, teamB, matchType, teamPhotos) => {
    setupMatch(teamA, teamB, matchType, teamPhotos);
    setShowSetup(false);
  };

  const handleNewMatch = () => {
    newMatch();
    setShowSetup(true);
  };

  const isMatchState = match.isStarted;

  return (
    <>
      <TopBar
        isMatchStarted={match.isStarted}
        isMatchOver={!!match.matchWinner}
        onResetMatch={resetMatch}
        onNewMatch={handleNewMatch}
        onOpenManager={onOpenManager}
      />


      <ScoreBumper bumper={bumper} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-5 md:py-8">
        <Header config={config} theme={theme} />

        {showSetup && <MatchSetup onStart={handleStartMatch} />}
        
        {isMatchState && (
          <BadmintonScoreboard
            match={match}
            photos={photos}
            currentSet={currentSet}
            currentAnalysis={currentAnalysis}
            animatingTeam={animatingTeam}
            isOnBreak={isOnBreak}
            onAddPoint={addPoint}
            onUndo={undoPoint}
            onStartSet={startSet}
            onEditName={(team, name) => setEditNameData({ team, currentName: name })}
            onEditPhoto={(teamKey, index) => setEditPhotoData({ teamKey, athleteIndex: index })}
          />
        )}

        {isMatchState && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Button onClick={resetMatch} variant="outline" className={`bg-white hover:bg-black/5 ${theme.text} border-black/10 rounded-xl px-5 cursor-pointer shadow-sm text-sm`}>
              <RotateCcw className="w-4 h-4 mr-1.5" /> Reset Skor
            </Button>
            <Button onClick={handleNewMatch} variant="outline" className={`bg-white hover:bg-black/5 ${theme.text} border-black/10 rounded-xl px-5 cursor-pointer shadow-sm text-sm`}>
              <Trash2 className="w-4 h-4 mr-1.5" /> Pertandingan Baru
            </Button>
          </div>
        )}

        <Footer />
      </div>

      <EditNameDialog
        open={!!editNameData}
        onOpenChange={(o) => { if (!o) setEditNameData(null); }}
        player={editNameData ? { id: editNameData.team, name: editNameData.currentName } : null}
        onSave={(_, name) => {
          if (editNameData) {
            saveTeamName(editNameData.team, name);
            setEditNameData(null);
          }
        }}
      />
      <EditPhotoDialog
        open={!!editPhotoData}
        onOpenChange={(o) => { if (!o) setEditPhotoData(null); }}
        teamId={editPhotoData?.teamKey}
        athleteIndex={editPhotoData?.athleteIndex ?? 0}
        currentPhoto={editPhotoData ? (photos[editPhotoData.teamKey] || [])[editPhotoData.athleteIndex] || null : null}
        onSave={savePhoto}
      />
    </>
  );
}
