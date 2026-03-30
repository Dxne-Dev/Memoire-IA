import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Loader2, Leaf } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Step2Context() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const projectId = params.get('project')

  const [title, setTitle]     = useState('')
  const [field, setField]     = useState('')
  const [problem, setProblem] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectId) return
    setLoading(true); setError(null)

    const { error } = await supabase
      .from('projects')
      .update({ title, field_of_study: field, problem_statement: problem, updated_at: new Date().toISOString() })
      .eq('id', projectId)

    if (error) { setError(error.message); setLoading(false); return }
    navigate(`/workspace/${projectId}`)
  }

  return (
    <div className="min-h-screen bg-[#071510] flex flex-col">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-700/18 blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link to="/dashboard" className="flex items-center gap-2 text-white/35 hover:text-white transition-colors text-sm font-medium">
          <Leaf className="w-4 h-4 text-emerald-400" /> Memoire IA
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-1.5 rounded-full bg-emerald-400" />
          <div className="w-8 h-1.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-white/25 text-xs font-semibold">Étape 2/2</span>
      </nav>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="glass rounded-3xl p-10 w-full max-w-xl shadow-2xl">
          <div className="text-center mb-8">
            <p className="text-xs font-bold tracking-widest uppercase text-emerald-400 mb-2">Étape 2 sur 2</p>
            <h1 className="text-3xl font-bold text-white">Contexte du projet</h1>
            <p className="text-white/35 text-sm mt-2 leading-relaxed max-w-sm mx-auto">
              Définissez votre sujet. Plus vous êtes précis, plus le Mode Mentor sera pertinent.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/35 uppercase tracking-wider block">Titre du mémoire</label>
              <input required value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Ex : L'impact de l'IA sur l'enseignement supérieur"
                className="field" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/35 uppercase tracking-wider block">Filière / Domaine</label>
              <input value={field} onChange={e => setField(e.target.value)}
                placeholder="Ex : Sciences de l'éducation, Informatique…"
                className="field" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/35 uppercase tracking-wider block">Problématique</label>
              <textarea required rows={4} value={problem} onChange={e => setProblem(e.target.value)}
                placeholder="Ex : Dans quelle mesure les LLMs remettent-ils en cause les méthodes d'évaluation traditionnelles ?"
                className="field resize-none" />
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>
            )}

            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => navigate('/new')} disabled={loading} className="btn-ghost">
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Préparation…</>
                  : <>Entrer dans l'éditeur <ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
