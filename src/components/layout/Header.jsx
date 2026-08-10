/**
 * App header with dynamic event info, logo, and tournament title.
 */
export function Header({ config }) {
  if (!config) return null; // Safe fallback

  return (
    <header className="text-center mb-6 md:mb-8">
      <div className="inline-flex flex-col items-center gap-1 mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-[0.6rem] md:text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full shadow-lg shadow-red-300/30">
            {config.eventName}
          </div>
        </div>
        <p className="text-red-400 text-[0.6rem] font-semibold tracking-[0.3em] uppercase">
          {config.eventDate}
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 mb-1">
        <img 
          src={config.tournamentLogo || "/logo.png"} 
          alt="Logo Turnamen" 
          className="w-20 h-20 md:w-36 md:h-36 object-contain drop-shadow-md bg-white/5" 
        />
      </div>
      <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-red-700 via-red-600 to-red-700 bg-clip-text text-transparent tracking-tight">
        {config.tournamentName}
      </h1>
      <p className="text-red-500/60 text-xs md:text-sm font-bold tracking-widest uppercase">
        {config.organizer}
      </p>
      <div className="flex items-center justify-center gap-3 mt-2">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-300" />
        <span className="text-amber-500 text-sm">★</span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-300" />
      </div>
    </header>
  );
}
