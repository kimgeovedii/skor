import { Routes, Route } from "react-router-dom";
import { LandingPage } from "@/components/scoreboard/LandingPage";
import { MatchPage } from "@/routes/MatchPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/match" element={<MatchPage />} />
    </Routes>
  );
}

export default App;
