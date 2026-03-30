import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UploadCloud, CheckCircle2, Loader2, ArrowRight, Leaf } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { extractTextFromFile } from '@/lib/extractor'
import { analyzeReferenceDocument } from '@/lib/ai'

function WizardNav({ step }: { step: number }) {
  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
      <Link to="/dashboard" className="flex items-center gap-2 text-white/35 hover:text-white transition-colors text-sm font-medium">
        <Leaf className="w-4 h-4 text-emerald-400" /> Memoire IA
      </Link>
      <div className="flex items-center gap-2">
        {[1, 2].map(i => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-emerald-400' : 'w-4 bg-white/12'}`} />
        ))}
      </div>
      <span className="text-white/25 text-xs font-semibold">Étape {step}/2</span>
    </nav>
  )
}

export default function Step1Upload() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const fileRef   = useRef<HTMLInputElement>(null)
  const [phase, setPhase]   = useState<'idle' | 'uploading' | 'done'>('idle')
  const [analysis, setAnalysis] = useState<{ pages: number; parts: number; style: string; summary?: string } | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setPhase('uploading')

    try {
      // 1. Upload to Supabase storage
      const path = `${user.id}/${Date.now()}_${file.name}`
      const { error: uploadErr } = await supabase.storage.from('reference-models').upload(path, file)
      if (uploadErr) { 
        alert("Erreur upload Supabase : " + uploadErr.message); 
        setPhase('idle'); 
        return; 
      }

      // 2. Create project row
      const { data: project, error: projErr } = await supabase
        .from('projects')
        .insert({ user_id: user.id, title: file.name.split('.')[0] || 'Nouveau mémoire', reference_model_url: path })
        .select()
        .single()

      if (projErr || !project) { 
        alert("Erreur base de données : " + (projErr?.message || "Inconnue")); 
        setPhase('idle'); 
        return; 
      }

      // 3. Real AI extraction
      const text = await extractTextFromFile(file);
      const realAnalysis = await analyzeReferenceDocument(text);

      // 4. Update Supabase with analysis
      await supabase.from('projects').update({ reference_analysis: realAnalysis }).eq('id', project.id)

      setProjectId(project.id)
      setAnalysis(realAnalysis)
      setPhase('done')
    } catch (err: any) {
      console.error(err)
      alert("Erreur lors de l'analyse IA : " + err.message)
      setPhase('idle')
    }
  }

  const handleNext = () => {
    if (projectId) navigate(`/new/context?project=${projectId}`)
  }

  return (
    <div className="min-h-screen bg-[#071510] flex flex-col">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-700/18 blur-[120px]" />
      </div>

      <WizardNav step={1} />

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="glass rounded-3xl p-10 w-full max-w-xl shadow-2xl">
          <div className="text-center mb-8">
            <p className="text-xs font-bold tracking-widest uppercase text-emerald-400 mb-2">Étape 1 sur 2</p>
            <h1 className="text-3xl font-bold text-white">Modèle de référence</h1>
            <p className="text-white/35 text-sm mt-2 leading-relaxed max-w-sm mx-auto">
              Téléchargez un mémoire exemplaire de votre filière. L'IA en extrait la structure pour calibrer votre parcours.
            </p>
          </div>

          {phase !== 'done' ? (
            <label className={`relative flex flex-col items-center justify-center gap-5 w-full min-h-[220px] rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
              phase === 'uploading' ? 'border-emerald-400/40 bg-emerald-500/5' : 'border-white/8 bg-white/2 hover:border-emerald-400/25 hover:bg-white/4'
            }`}>
              <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleFile} disabled={phase === 'uploading'} />
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                phase === 'uploading' ? 'bg-emerald-500/12 border-emerald-400/25 text-emerald-400' : 'bg-white/4 border-white/8 text-white/35'
              }`}>
                {phase === 'uploading' ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white/60">
                  {phase === 'uploading' ? 'Analyse structurelle en cours…' : 'Cliquez ou glissez votre fichier'}
                </p>
                <p className="text-xs text-white/25 mt-0.5">
                  {phase === 'uploading' ? 'Extraction de la hiérarchie et du format' : 'PDF ou Word — max 20 MB'}
                </p>
              </div>
            </label>
          ) : (
            <div className="flex items-start gap-4 p-5 bg-emerald-500/8 border border-emerald-400/18 rounded-2xl w-full text-left">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white font-semibold flex items-center gap-2">
                  Analyse IA terminée <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                </p>
                <div className="mt-3 bg-black/20 rounded-xl p-4 border border-white/5">
                  <p className="text-white/70 text-sm italic leading-relaxed">
                    "{analysis?.summary || 'Résumé non disponible.'}"
                  </p>
                </div>
                <ul className="text-white/45 text-sm mt-4 space-y-1.5 leading-relaxed bg-white/5 rounded-xl p-4">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400/50" /> {analysis?.pages} pages textuelles détectées</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400/50" /> {analysis?.parts} blocs structurels repérés</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400/50" /> Ton : <span className="text-emerald-300">{analysis?.style}</span></li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button onClick={handleNext} disabled={phase !== 'done'} className="btn-primary">
              Continuer <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
