import { useLocalStorage } from "./useLocalStorage";

const CONFIG_KEY = "skor-tournament-config-v1";

const defaultConfig = {
  tournamentName: "Turnamen Badminton",
  organizer: "PT LPP Agro Nusantara",
  eventName: "DIRGAHAYU REPUBLIK INDONESIA KE-81",
  eventDate: "17 Agustus 2026",
  sportType: "badminton", // Only badminton for now
  tournamentLogo: "",
};

export function useTournamentConfig() {
  const [config, setConfig] = useLocalStorage(CONFIG_KEY, defaultConfig);

  const updateConfig = (newConfig) => {
    setConfig({ ...config, ...newConfig });
  };

  const isConfigured = config.tournamentName !== "" && config.organizer !== "";

  return {
    config,
    updateConfig,
    isConfigured,
  };
}
