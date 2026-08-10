import { Play, Settings, Trophy, Mic, Music, Activity, Code2, Cpu, Zap, Layout, Globe, Link, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTournamentConfig } from "@/hooks/useTournamentConfig";

/**
 * Full-screen Portfolio-style Landing Page for Kim Geovedi.
 */
export function LandingPage() {
  const navigate = useNavigate();
  const { isConfigured } = useTournamentConfig();

  const handleStart = () => {
    navigate("/match");
  };

  return (
    <main className="min-h-screen bg-[#0f1923] text-white overflow-x-hidden selection:bg-red-500/30">
      
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center justify-center p-4">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 z-10" />
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
        
        <div className="w-full max-w-5xl mx-auto z-10 relative">
          <div className="bg-[#1a1a2e]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 p-8 md:p-16 shadow-2xl">
            
            <header className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold tracking-widest uppercase text-white/60">Portfolio Project</span>
              </div>
              <h2 className="text-red-400 text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-3">
                Scoreboard Application Developed By
              </h2>
              <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-sm tracking-tight mb-6">
                Kim Geovedi
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-xl leading-relaxed">
                Sebuah aplikasi <strong>Smart Scoreboard</strong> interaktif berbasis ReactJS, dilengkapi dengan teknologi <em>AI Voice-Over</em> pintar yang mendeteksi jalannya turnamen olahraga secara real-time.
              </p>
            </header>

            <article className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mb-12 text-left mx-auto">
              <FeatureCard 
                icon={<Mic className="w-6 h-6 text-sky-400" />}
                title="Smart Voice-Over Assistant"
                desc="Sistem narasi virtual dengan Web Speech API yang memberikan komentar dinamis dan interaktif sesuai algoritma skor pertandingan."
              />
              <FeatureCard 
                icon={<Activity className="w-6 h-6 text-amber-400" />}
                title="Context-Aware Algorithm"
                desc="Mampu mendeteksi secara akurat momentum turnamen seperti epic comeback, deuce point, dan dominasi tim."
              />
              <FeatureCard 
                icon={<Music className="w-6 h-6 text-emerald-400" />}
                title="Audio Ducking & Event Loop"
                desc="Transisi volume otomatis antara musik background dan suara host selama masa break antar set."
              />
              <FeatureCard 
                icon={<Trophy className="w-6 h-6 text-red-400" />}
                title="Scalable Tournament App"
                desc="Sistem konfigurasi dinamis yang menyimpan sesi pertandingan di local storage, siap digunakan untuk berbagai event olahraga."
              />
            </article>

            <nav className="flex flex-col items-center justify-center gap-4 mt-12" aria-label="Primary Navigation">
              <button
                onClick={handleStart}
                aria-label="Mulai Aplikasi Scoreboard"
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-red-500/20 overflow-hidden transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <Play className="w-6 h-6 relative z-10" /> 
                <span className="text-lg relative z-10">Mulai Aplikasi Skor</span>
              </button>
              
              <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs text-emerald-400 font-medium">
                  <strong>100% Private:</strong> Data turnamen dan skor hanya disimpan di penyimpanan lokal browser (Local Storage) device Anda. Sistem tidak menggunakan server dan tidak mengambil data Anda sama sekali.
                </p>
              </div>
            </nav>

          </div>
        </div>
      </section>

      {/* ── TECH STACK SECTION ── */}
      <section className="py-24 bg-black/20 border-y border-white/5 relative">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Teknologi yang Digunakan</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            Dibangun dengan modern web technologies untuk memastikan performa yang cepat, animasi yang mulus, dan pengalaman pengguna yang luar biasa.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <TechBadge icon={<Code2 />} name="ReactJS 19" />
            <TechBadge icon={<Layout />} name="Tailwind CSS 4" />
            <TechBadge icon={<Zap />} name="Vite" />
            <TechBadge icon={<Cpu />} name="Web Speech API" />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS SECTION ── */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-16 text-center">Cara Kerja Aplikasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500/50 to-transparent -translate-y-1/2" />
            
            <StepCard 
              step="1"
              title="Konfigurasi"
              desc="Atur nama turnamen, penyelenggara, dan nama event sesuai kebutuhan Anda. Sistem menyimpan preferensi secara otomatis."
            />
            <StepCard 
              step="2"
              title="Pertandingan"
              desc="Skor secara real-time. Sistem AI mendeteksi jalannya pertandingan dan host virtual akan memberikan komentar."
            />
            <StepCard 
              step="3"
              title="Istirahat & Pemenang"
              desc="Saat break, musik background dimainkan dengan audio ducking saat host berbicara. Skor akhir dirayakan dengan selebrasi."
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER / ABOUT DEVELOPER ── */}
      <footer className="py-12 bg-black/40 border-t border-white/5 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-xl font-bold text-white mb-2">Kim Geovedi</h3>
          <p className="text-gray-400 text-sm mb-6">Frontend Developer & UI/UX Enthusiast</p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <SocialLink icon={<Globe className="w-5 h-5" />} href="#" />
            <SocialLink icon={<Link className="w-5 h-5" />} href="#" />
            <SocialLink icon={<Mail className="w-5 h-5" />} href="#" />
          </div>
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Kim Geovedi. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <section className="bg-white/5 border border-white/5 p-5 rounded-2xl hover:bg-white/10 transition-colors group">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-black/30 rounded-xl group-hover:scale-110 transition-transform" aria-hidden="true">
          {icon}
        </div>
        <div>
          <h3 className="text-white font-bold text-base mb-1.5">{title}</h3>
          <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
        </div>
      </div>
    </section>
  );
}

function TechBadge({ icon, name }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all hover:-translate-y-1">
      <div className="text-gray-400 mb-3">{icon}</div>
      <span className="text-sm font-bold text-gray-300">{name}</span>
    </div>
  );
}

function StepCard({ step, title, desc }) {
  return (
    <div className="relative bg-[#16213e] p-8 rounded-3xl border border-white/5 text-center shadow-xl z-10 hover:-translate-y-2 transition-transform">
      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-6 shadow-lg shadow-red-500/30">
        {step}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function SocialLink({ icon, href }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-3 bg-white/5 hover:bg-red-500 hover:text-white text-gray-400 rounded-full transition-all hover:-translate-y-1"
    >
      {icon}
    </a>
  );
}
