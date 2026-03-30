import { PenTool } from 'lucide-react'

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass rounded-3xl ${className}`}>{children}</div>
}

export default function Projects() {
  return (
    <div className="relative min-h-screen overflow-x-hidden p-8">
      {/* Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-emerald-700/18 blur-[130px]" />
      </div>

      <header className="relative z-10 mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <PenTool className="w-8 h-8 text-emerald-400" />
          Mes Mémoires
        </h1>
        <p className="text-white/40 mt-2">Gérez tous vos projets de rédaction.</p>
      </header>

      <main className="relative z-10">
        <GlassCard className="p-12 flex flex-col items-center justify-center text-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/12 border border-emerald-400/20 flex items-center justify-center">
            <PenTool className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Bientôt disponible</h2>
            <p className="text-white/40 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
              La gestion avancée des mémoires arrivera dans une prochaine mise à jour. 
              Pour le moment, vous pouvez retrouver et continuer vos mémoires en cours depuis le Dashboard.
            </p>
          </div>
        </GlassCard>
      </main>
    </div>
  )
}
