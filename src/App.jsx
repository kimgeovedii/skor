import { useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Hooks
import { useScoreboard } from "@/hooks/useScoreboard";

// Layout
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";

// Scoreboard views
import { EmptyState } from "@/components/scoreboard/EmptyState";
import { MatchSetup } from "@/components/scoreboard/MatchSetup";
import { BadmintonScoreboard } from "@/components/scoreboard/FootballScoreboard";

// Shared
import { ScoreBumper } from "@/components/shared/ScoreBumper";

// Dialogs
import { EditNameDialog } from "@/components/dialogs/EditNameDialog";
import { EditPhotoDialog } from "@/components/dialogs/EditPhotoDialog";

/**
 * Main application — orchestrates match flow:
 * EmptyState → MatchSetup → BadmintonScoreboard
 */
function App() {
  const {
    match, photos, animatingTeam, bumper,
    currentSet, currentAnalysis, isOnBreak,
    addPoint, undoPoint, startSet,
    setupMatch, resetMatch, newMatch,
    saveTeamName, savePhoto,
  } = useScoreboard();

  // UI state
  const [showSetup, setShowSetup] = useState(false);
  const [editNameData, setEditNameData] = useState(null); // { team: "a"|"b", currentName }
  const [editPhotoData, setEditPhotoData] = useState(null); // { teamKey: "teamA"|"teamB", athleteIndex }

  // Handlers
  const handleStartMatch = (teamA, teamB, matchType, teamPhotos) => {
    setupMatch(teamA, teamB, matchType, teamPhotos);
    setShowSetup(false);
  };

  const handleEditName = (team, currentName) => {
    setEditNameData({ team, currentName });
  };

  const handleSaveName = (_, name) => {
    if (editNameData) {
      saveTeamName(editNameData.team, name);
      setEditNameData(null);
    }
  };

  const handleEditPhoto = (teamKey, athleteIndex) => {
    setEditPhotoData({ teamKey, athleteIndex });
  };

  const handleNewMatch = () => {
    newMatch();
    setShowSetup(false);
  };

  // Current photo for edit dialog
  const editPhotoCurrentPhoto = editPhotoData
    ? (photos[editPhotoData.teamKey] || [])[editPhotoData.athleteIndex] || null
    : null;

  // Determine view
  const isEmptyState = !match.isStarted && !showSetup;
  const isSetupState = !match.isStarted && showSetup;
  const isMatchState = match.isStarted;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50 text-gray-900 overflow-hidden relative">
      {/* Decorative borders */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 z-40" />
      <div className="fixed bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 z-40" />

      {/* Background blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      {/* Top toolbar */}
      <TopBar
        isMatchStarted={match.isStarted}
        isMatchOver={!!match.matchWinner}
        onResetMatch={resetMatch}
        onNewMatch={handleNewMatch}
      />

      {/* Bumper overlay */}
      <ScoreBumper bumper={bumper} />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-5 md:py-8">
        <Header />

        {isEmptyState && <EmptyState onSetup={() => setShowSetup(true)} />}
        {isSetupState && <MatchSetup onStart={handleStartMatch} />}
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
            onEditName={handleEditName}
            onEditPhoto={handleEditPhoto}
          />
        )}

        {/* Match action buttons */}
        {isMatchState && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Button onClick={resetMatch} variant="outline" className="bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 rounded-xl px-5 cursor-pointer shadow-sm text-sm">
              <RotateCcw className="w-4 h-4 mr-1.5" /> Reset Skor
            </Button>
            <Button onClick={handleNewMatch} variant="outline" className="bg-white hover:bg-red-50 text-red-500 border-red-200 hover:border-red-400 rounded-xl px-5 cursor-pointer shadow-sm text-sm">
              <Trash2 className="w-4 h-4 mr-1.5" /> Pertandingan Baru
            </Button>
          </div>
        )}

        <Footer />
      </div>

      {/* Dialogs */}
      <EditNameDialog
        open={!!editNameData}
        onOpenChange={(o) => { if (!o) setEditNameData(null); }}
        player={editNameData ? { id: editNameData.team, name: editNameData.currentName } : null}
        onSave={handleSaveName}
      />
      <EditPhotoDialog
        open={!!editPhotoData}
        onOpenChange={(o) => { if (!o) setEditPhotoData(null); }}
        teamId={editPhotoData?.teamKey}
        athleteIndex={editPhotoData?.athleteIndex ?? 0}
        currentPhoto={editPhotoCurrentPhoto}
        onSave={savePhoto}
      />
    </div>
  );
}

export default App;
