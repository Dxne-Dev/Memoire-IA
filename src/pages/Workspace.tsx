import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Project, Section, Message } from '@/lib/types'
import { ArrowLeft, Send, PenTool, Download, Loader2, MessageSquare, CheckCircle2 } from 'lucide-react'
import { chatWithMentor, generatePlan, generateSectionContent } from '@/lib/ai'

function MentorStructuredMessage({ content, isLatest, onReply }: { content: string, isLatest: boolean, onReply: (text: string) => void }) {
  let parsed: any = null
  try {
    parsed = JSON.parse(content)
  } catch (e) {
    // Si ce n'est pas du JSON, on l'affiche tel quel
    return <div className="whitespace-pre-wrap">{content}</div>
  }

  if (!parsed || !parsed.message) return <div className="whitespace-pre-wrap">{content}</div>

  const [answers, setAnswers] = useState<Record<number, string>>({})
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!parsed.questions) return
    let reply = ""
    parsed.questions.forEach((q: string, idx: number) => {
      reply += `- ${q}\n  -> ${answers[idx] || "Non renseigné"}\n\n`
    })
    onReply("Voici les informations :\n" + reply)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="whitespace-pre-wrap">{parsed.message}</p>
      
      {parsed.questions && parsed.questions.length > 0 && (
        <form onSubmit={handleSubmit} className="mt-2 bg-emerald-950/20 border border-emerald-500/10 p-4 rounded-xl space-y-4">
          {parsed.questions.map((q: string, idx: number) => (
            <div key={idx} className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-emerald-300/80">{q}</label>
              <textarea 
                rows={2}
                disabled={!isLatest}
                placeholder="Votre réponse..."
                className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/40 resize-none transition-colors disabled:opacity-50"
                value={answers[idx] || ''}
                onChange={e => setAnswers({ ...answers, [idx]: e.target.value })}
              />
            </div>
          ))}
          {isLatest && (
            <button type="submit" className="w-full mt-2 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Envoyer mes réponses
            </button>
          )}
        </form>
      )}
    </div>
  )
}

export default function Workspace() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()

  const [project,  setProject]  = useState<Project | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [input,    setInput]    = useState('')
  const [sending,  setSending]  = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  /* Load project + sections */
  useEffect(() => {
    if (!id) return
    supabase.from('projects').select('*').eq('id', id).single()
      .then(({ data }) => { setProject(data as Project) })

    supabase.from('sections').select('*').eq('project_id', id).order('order_index')
      .then(({ data }) => { setSections((data as Section[]) ?? []) })

    supabase.from('messages').select('*').eq('project_id', id).order('created_at')
      .then(({ data }) => { setMessages((data as Message[]) ?? []) })
  }, [id])

  /* Auto-scroll chat */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (customText?: string) => {
    const textToSend = customText ?? input;
    if (!textToSend.trim() || !id || !user || !project) return
    setSending(true)

    try {
      const userMsg: Omit<Message, 'id' | 'created_at'> = {
        project_id: id, section_id: activeSection?.id ?? null,
        role: 'user', content: textToSend.trim(),
      }
      const { data: saved, error: saveErr } = await supabase.from('messages').insert(userMsg).select().single()
      if (saveErr) throw saveErr

      const msgSaved = saved as Message
      setMessages(prev => [...prev, msgSaved])
      if (customText === undefined) setInput('')

      // 1. Récupérer l'historique avec le nouveau message
      const allMessages = [...messages, msgSaved]
      
      // 2. Réelle Réponse IA (API Groq/OpenAI via ai.ts)
      const aiResponseText = await chatWithMentor(project, activeSection, allMessages)

      // 3. Sauvegarder la réponse en BDD
      const aiReply: Omit<Message, 'id' | 'created_at'> = {
        project_id: id, section_id: activeSection?.id ?? null,
        role: 'assistant',
        content: aiResponseText,
      }
      const { data: aiSaved, error: aiSaveErr } = await supabase.from('messages').insert(aiReply).select().single()
      if (aiSaveErr) throw aiSaveErr

      setMessages(prev => [...prev, aiSaved as Message])
    } catch (err: any) {
      console.error(err)
      alert("Erreur du Mentor IA : " + err.message)
    } finally {
      setSending(false)
    }
  }

  const handleGenerate = async () => {
    if (!id || !project || isGenerating) return
    setIsGenerating(true)

    try {
      if (sections.length === 0) {
        // 1. Generate plan
        const plan = await generatePlan(project)
        if (plan && plan.sections) {
          const newSections = plan.sections.map((s: any, idx: number) => ({
            project_id: id,
            title: s.title,
            order_index: idx
          }))
          const { data, error } = await supabase.from('sections').insert(newSections).select()
          if (error) throw error
          setSections(data as Section[])
          if (data && data.length > 0) setActiveSection(data[0] as Section)
        }
      } else if (activeSection && !activeSection.content) {
        // 2. Generate section content
        const content = await generateSectionContent(project, activeSection, messages)
        const { data, error } = await supabase.from('sections').update({ content }).eq('id', activeSection.id).select().single()
        if (error) throw error
        setSections(prev => prev.map(s => s.id === activeSection.id ? (data as Section) : s))
        setActiveSection(data as Section)
      }
    } catch (err: any) {
      console.error(err)
      alert("Erreur de génération : " + err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!project) return (
    <div className="flex h-screen items-center justify-center bg-[#071510]">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
    </div>
  )

  return (
    <div className="flex h-screen bg-[#071510] overflow-hidden">

      {/* ── LEFT: Editor ── */}
      <div className="flex-[7] flex flex-col h-full border-r border-white/6">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/6 bg-white/2 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <button className="w-8 h-8 rounded-full bg-white/6 hover:bg-white/12 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <div>
              <h1 className="text-sm font-bold text-white">{project.title}</h1>
              <p className="text-xs text-white/25 font-medium">Mode Mentor actif · {project.field_of_study || '—'}</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-white/50 hover:text-white text-xs font-semibold transition-colors">
            <Download className="w-3.5 h-3.5" /> Exporter
          </button>
        </header>

        {/* Section tabs */}
        <div className="flex gap-2 px-6 py-3 border-b border-white/5 overflow-x-auto flex-shrink-0">
          {sections.map(s => (
            <button key={s.id}
              onClick={() => setActiveSection(s)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeSection?.id === s.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/25'
                  : 'text-white/30 hover:text-white hover:bg-white/6'
              }`}>
              {s.title}
            </button>
          ))}
          {sections.length === 0 && (
            <p className="text-white/20 text-xs py-1">Les sections apparaîtront ici après génération…</p>
          )}
        </div>

        {/* Editor body */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[720px] mx-auto py-14 px-8 flex flex-col min-h-[calc(100vh-140px)]">
            {activeSection ? (
              <>
                <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">{activeSection.title}</h2>
                {activeSection.content ? (
                  <textarea 
                    className="w-full flex-1 bg-transparent border-none outline-none resize-none text-white/70 text-lg leading-8 focus:ring-0 prose prose-invert p-0"
                    value={activeSection.content}
                    onChange={(e) => {
                      const newContent = e.target.value;
                      setActiveSection({ ...activeSection, content: newContent });
                      setSections(prev => prev.map(s => s.id === activeSection.id ? { ...s, content: newContent } : s));
                    }}
                    onBlur={(e) => {
                      supabase.from('sections').update({ content: e.target.value }).eq('id', activeSection.id).then();
                    }}
                  />
                ) : (
                  <div className="flex items-start gap-4 p-6 rounded-2xl border-l-4 border-emerald-400/50 bg-emerald-500/4">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0 mt-1.5" />
                    <p className="text-white/35 text-sm leading-relaxed italic">
                      Cette section est vide. Répondez aux questions du{' '}
                      <span className="text-emerald-400 not-italic font-semibold">Mentor IA</span>{' '}
                      pour générer un premier jet.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center pt-20">
                <PenTool className="w-10 h-10 text-white/10 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Aucune section active</h3>
                <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
                  {sections.length === 0 
                    ? "Générez le plan de votre mémoire avec le Mentor IA pour commencer la rédaction."
                    : "Sélectionnez une section dans le menu supérieur pour commencer à rédiger ou demander l'aide du Mentor."}
                </p>
                {sections.length === 0 && (
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="mt-6 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2 mx-auto"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenTool className="w-4 h-4" />}
                    Générer le plan
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── RIGHT: Mentor chat ── */}
      <div className="flex-[3] max-w-[400px] h-full flex flex-col bg-[#0b1d16]/50">
        <header className="px-5 py-4 border-b border-white/6 flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/18 border border-emerald-400/22 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Mode Mentor</p>
            <p className="text-xs text-emerald-400/65 font-medium">Analyse contextuelle active</p>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/18 border border-emerald-400/18 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[10px] font-bold text-emerald-400">IA</span>
              </div>
              <div className="glass rounded-2xl rounded-tl-none p-4 text-sm text-white/75 leading-relaxed">
                J'ai analysé votre modèle de référence. Prêt à vous guider section par section.<br /><br />
                <span className="text-white font-semibold">Par où souhaitez-vous commencer ?</span>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-emerald-500/18 border border-emerald-400/18 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[10px] font-bold text-emerald-400">IA</span>
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-500/15 border border-emerald-400/20 text-white rounded-tr-none'
                  : 'glass text-white/75 rounded-tl-none'
              }`}>
                {msg.role === 'assistant' 
                  ? <MentorStructuredMessage content={msg.content} isLatest={idx === messages.length - 1} onReply={sendMessage} />
                  : <div className="whitespace-pre-wrap">{msg.content}</div>
                }
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/18 border border-emerald-400/18 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-emerald-400">IA</span>
              </div>
              <div className="glass rounded-2xl rounded-tl-none p-4">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/6 flex-shrink-0">
          <div className="relative">
            <textarea
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Répondre au mentor…" rows={2}
              className="field resize-none pr-12 text-sm"
            />
            <button onClick={sendMessage} disabled={sending || !input.trim()}
              className="absolute right-3 bottom-3 w-8 h-8 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40
                rounded-xl flex items-center justify-center transition-colors shadow-lg">
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || (sections.length > 0 && (!activeSection || !!activeSection.content))}
              className="text-xs text-white/40 hover:text-emerald-400 font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-30 disabled:hover:text-white/40"
            >
              {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <PenTool className="w-3 h-3" />} 
              {sections.length === 0 ? "Générer le plan" : "Générer la section"}
            </button>
            <span className="text-[10px] text-white/15">Entrée pour envoyer</span>
          </div>
        </div>
      </div>
    </div>
  )
}
