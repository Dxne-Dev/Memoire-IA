import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Project } from '@/lib/types'
import { Plus, ChevronRight, PenTool, Sparkles, BookOpen, Loader2 } from 'lucide-react'

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass rounded-3xl ${className}`}>{children}</div>
}

function ProgressRing({ value }: { value: number }) {
  const r = 30, c = 2 * Math.PI * r
  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle cx="40" cy="40" r={r} fill="none" stroke="url(#rg)" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
        {value}%
      </span>
    </div>
  )
}

function pct(p: Project) {
  const total = p.sections?.length ?? 0
  const done  = p.sections?.filter(s => s.status === 'completed').length ?? 0
  return total > 0 ? Math.round((done / total) * 100) : 0
}

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('projects')
      .select('*, sections(*)')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .then(({ data }) => { setProjects((data as Project[]) ?? []); setLoading(false) })
  }, [user])

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
    </div>
  )

  const globalPct = projects.length
    ? Math.round(projects.reduce((a, p) => a + pct(p), 0) / projects.length)
    : 0
  const latest = projects[0]
  const firstName = user?.user_metadata?.name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'Étudiant'

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-emerald-700/18 blur-[130px]" />
        <div className="absolute bottom-0 right-10 w-[350px] h-[350px] rounded-full bg-teal-800/20 blur-[100px]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-8 pt-8 pb-6">
        <div>
          <p className="text-xs font-semibold text-white/25 tracking-widest uppercase mb-0.5">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-3xl font-bold text-white">Bonjour, {firstName} 👋</h1>
        </div>
        <Link to="/new">
          <button className="btn-primary">
            <Plus className="w-4 h-4" /> Nouveau mémoire
          </button>
        </Link>
      </header>

      <main className="relative z-10 px-8 pb-12 space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hero card */}
          <div className="lg:col-span-2">
            {latest ? (
              <GlassCard className="p-8 flex flex-col justify-between min-h-[240px] relative overflow-hidden group">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 space-y-1">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase
                    text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    En cours
                  </span>
                  <h2 className="text-2xl font-bold text-white leading-snug">{latest.title}</h2>
                  <p className="text-white/40 text-sm font-medium">{latest.field_of_study || '—'}</p>
                </div>
                <div className="relative z-10 space-y-3 mt-8">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-white/40">Progression</span>
                    <span className="text-white font-bold">{pct(latest)}%</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${pct(latest)}%` }} /></div>
                  <div className="pt-2">
                    <Link to={`/workspace/${latest.id}`}>
                      <button className="w-full h-12 rounded-2xl bg-white text-[#0d2b22] font-bold text-sm
                        hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                        Reprendre la rédaction <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="p-10 flex flex-col items-center justify-center text-center gap-5 min-h-[240px]">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/12 border border-emerald-400/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Commencez votre premier mémoire</h2>
                  <p className="text-white/35 text-sm mt-1 max-w-xs mx-auto">
                    L'IA analyse votre modèle de référence et vous guide section par section.
                  </p>
                </div>
                <Link to="/new"><button className="btn-primary">Démarrer maintenant</button></Link>
              </GlassCard>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-5">
            <GlassCard className="p-6 flex items-center gap-5">
              <ProgressRing value={globalPct} />
              <div>
                <p className="text-white/30 text-xs font-semibold uppercase tracking-widest">Global</p>
                <p className="text-white text-lg font-bold leading-tight mt-1">Progression<br />totale</p>
                <p className="text-white/30 text-xs mt-1">{projects.length} mémoire{projects.length > 1 ? 's' : ''}</p>
              </div>
            </GlassCard>
            <GlassCard className="p-6 grid grid-cols-2 gap-4 flex-1">
              <div>
                <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-1">Complétées</p>
                <p className="text-3xl font-bold text-white">
                  {projects.reduce((a, p) => a + (p.sections?.filter(s => s.status === 'completed').length ?? 0), 0)}
                </p>
                <p className="text-xs text-emerald-400 font-medium mt-0.5">sections</p>
              </div>
              <div>
                <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-1">Restantes</p>
                <p className="text-3xl font-bold text-white">
                  {projects.reduce((a, p) => a + (p.sections?.filter(s => s.status !== 'completed').length ?? 0), 0)}
                </p>
                <p className="text-xs text-white/25 font-medium mt-0.5">sections</p>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Row 2 — Project grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white/25 uppercase tracking-widest flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Tous les travaux
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map(project => (
              <Link key={project.id} to={`/workspace/${project.id}`}>
                <GlassCard className="p-5 flex flex-col gap-4 group cursor-pointer hover:border-emerald-500/30 transition-all duration-200">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-400/15 flex items-center justify-center flex-shrink-0">
                      <PenTool className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-emerald-300 transition-colors">{project.title}</p>
                      <p className="text-white/25 text-xs font-medium mt-0.5 uppercase tracking-wide">{project.field_of_study || '—'}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-white/25">Progression</span>
                      <span className="text-white/55">{pct(project)}%</span>
                    </div>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${pct(project)}%` }} /></div>
                  </div>
                </GlassCard>
              </Link>
            ))}

            {/* Add tile */}
            <Link to="/new">
              <div className="flex flex-col items-center justify-center gap-3 p-5 min-h-[140px] rounded-3xl
                border-2 border-dashed border-white/8 hover:border-emerald-400/30
                cursor-pointer group transition-all duration-200">
                <div className="w-9 h-9 rounded-xl bg-white/4 group-hover:bg-emerald-500/12 border border-white/8 group-hover:border-emerald-400/20 flex items-center justify-center transition-all">
                  <Plus className="w-4 h-4 text-white/20 group-hover:text-emerald-400 transition-colors" />
                </div>
                <span className="text-xs font-semibold text-white/18 group-hover:text-emerald-400/70 transition-colors tracking-wide">
                  Nouveau mémoire
                </span>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
