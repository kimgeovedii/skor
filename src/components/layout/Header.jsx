/**
 * App header with HUT RI badge, logo, and tournament title.
 */
export function Header() {
  return (
    <header className="text-center mb-6 md:mb-8">
      <div className="inline-flex flex-col items-center gap-1 mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-[0.6rem] md:text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full shadow-lg shadow-red-300/30">
            DIRGAHAYU REPUBLIK INDONESIA KE-81
          </div>
        </div>
        <p className="text-red-400 text-[0.6rem] font-semibold tracking-[0.3em] uppercase">
          17 Agustus 2026
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 mb-1">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain drop-shadow-md" />
      </div>
      <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-red-700 via-red-600 to-red-700 bg-clip-text text-transparent tracking-tight">
        Turnamen Badminton
      </h1>
      <p className="text-red-500/60 text-xs md:text-sm font-bold tracking-widest uppercase">
        PT LPP Agro Nusantara
      </p>
      <div className="flex items-center justify-center gap-3 mt-2">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-300" />
        <span className="text-amber-500 text-sm">★</span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-300" />
      </div>
    </header>
  );
}
