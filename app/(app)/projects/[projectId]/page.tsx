"use client"

import { useState, useEffect, useRef } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
    Brain,
    Send,
    Save,
    ChevronLeft,
    Loader2,
    CheckCircle2,
    Circle,
    Sparkles
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Project, SectionMetadata, SectionMessage } from "@/lib/types/project"

export default function ProjectWorkspacePage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.projectId as string

    const [project, setProject] = useState<Project | null>(null)
    const [currentSectionId, setCurrentSectionId] = useState<string | null>(null)
    const [draft, setDraft] = useState("")
    const [messages, setMessages] = useState<SectionMessage[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [isGenerating, setIsGenerating] = useState(false)

    const scrollAreaRef = useRef<HTMLDivElement>(null)

    // 1. Charger le projet
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${projectId}`)
                if (!response.ok) throw new Error("Projet introuvable")
                const data = await response.json()
                setProject(data)
                if (data.structure.length > 0) {
                    setCurrentSectionId(data.structure[0].id)
                }
            } catch (error) {
                console.error(error)
                toast.error("Erreur lors du chargement du projet")
                router.push("/projects")
            } finally {
                setIsLoading(false)
            }
        }
        fetchProject()
    }, [projectId, router])

    // 2. Charger les messages et le draft quand la section change
    useEffect(() => {
        if (!currentSectionId) return

        const fetchData = async () => {
            try {
                // Charger les messages
                const chatRes = await fetch(`/api/projects/${projectId}/sections/${currentSectionId}/chat`)
                if (chatRes.ok) {
                    const chatData = await chatRes.json()
                    setMessages(chatData)
                }

                // Charger le draft
                const draftRes = await fetch(`/api/projects/${projectId}/sections/${currentSectionId}/draft`)
                if (draftRes.ok) {
                    const draftData = await draftRes.json()
                    setDraft(draftData.content || "")
                }
            } catch (error) {
                console.error("Error loading section data", error)
            }
        }
        fetchData()
    }, [projectId, currentSectionId])

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !currentSectionId || isSending) return

        const userMsg: any = { role: 'user', content: newMessage, timestamp: new Date() }
        setMessages(prev => [...prev, userMsg])
        const tempMsg = newMessage
        setNewMessage("")
        setIsSending(true)

        try {
            const response = await fetch(`/api/projects/${projectId}/sections/${currentSectionId}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: tempMsg })
            })

            if (!response.ok) throw new Error("Erreur IA")
            const aiMsg = await response.json()
            setMessages(prev => [...prev, aiMsg])
        } catch (error) {
            console.error(error)
            toast.error("Le mentor IA n'a pas pu répondre")
        } finally {
            setIsSending(false)
        }
    }

    const handleGenerateDraft = async () => {
        if (!currentSectionId || isGenerating) return

        if (messages.length === 0) {
            toast.error("Discutez d'abord avec le mentor pour lui donner de la matière !")
            return
        }

        setIsGenerating(true)
        try {
            const response = await fetch(`/api/projects/${projectId}/sections/${currentSectionId}/generate-draft`, {
                method: "POST"
            })
            if (!response.ok) throw new Error("Génération échouée")
            const data = await response.json()
            setDraft(data.draft)
            toast.success("Brouillon généré par le mentor !")
        } catch (error) {
            toast.error("Erreur lors de la génération")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSaveDraft = async () => {
        if (!currentSectionId || isSaving) return
        setIsSaving(true)
        try {
            await fetch(`/api/projects/${projectId}/sections/${currentSectionId}/draft`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: draft })
            })
            toast.success("Brouillon sauvegardé")
        } catch (error) {
            toast.error("Erreur de sauvegarde")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        )
    }

    const currentSection = project?.structure.find((s: SectionMetadata) => s.id === currentSectionId)

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            {/* Workspace Header */}
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-white z-10">
                <SidebarTrigger className="-ml-1" />
                <div className="flex-1 flex items-center space-x-2 overflow-hidden">
                    <Link href="/projects" className="text-slate-400 hover:text-slate-600">
                        <ChevronLeft className="w-4 h-4" />
                    </Link>
                    <span className="font-semibold truncate">{project?.title}</span>
                    <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">
                        {project?.fieldOfStudy}
                    </Badge>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSaveDraft}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        <span className="hidden sm:inline">Sauvegarder</span>
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Finaliser</span>
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* 1. Exploration Sidebar (Plan) */}
                <div className="w-64 border-r bg-slate-50 flex flex-col overflow-hidden shrink-0">
                    <div className="p-4 border-b bg-white">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plan du mémoire</h3>
                    </div>
                    <ScrollArea className="flex-1 p-2">
                        <div className="space-y-1">
                            {project?.structure.map((section: SectionMetadata) => (
                                <button
                                    key={section.id}
                                    onClick={() => setCurrentSectionId(section.id)}
                                    className={`w-full flex items-center p-3 rounded-lg text-sm transition-all ${currentSectionId === section.id
                                        ? "bg-white shadow-sm text-blue-600 font-semibold border-l-4 border-blue-600"
                                        : "text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {section.status === 'completed' ? (
                                        <CheckCircle2 className="w-4 h-4 mr-3 text-green-500" />
                                    ) : (
                                        <Circle className="w-4 h-4 mr-3 text-slate-300" />
                                    )}
                                    <span className="truncate">{section.title}</span>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* 2. Writing Canvas */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="font-bold text-slate-800">{currentSection?.title}</h2>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={handleGenerateDraft}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                            ) : (
                                <Sparkles className="w-3 h-3 mr-2" />
                            )}
                            Générer le brouillon
                        </Button>
                    </div>
                    <div className="flex-1 p-8 overflow-auto">
                        <div className="max-w-3xl mx-auto h-full">
                            <Textarea
                                className="w-full h-full min-h-[500px] border-0 focus-visible:ring-0 text-lg leading-relaxed resize-none p-0 scroll-smooth"
                                placeholder="Commencez à rédiger ici ou discutez avec votre mentor IA à droite pour générer des idées..."
                                value={draft}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDraft(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Mentor Chat Sidebar */}
                <div className="w-[350px] border-l bg-slate-50 flex flex-col overflow-hidden shrink-0">
                    <div className="p-4 border-b bg-white flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Brain className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-slate-800">Mentor IA</h3>
                            <p className="text-[10px] text-slate-400">Section: {currentSection?.title}</p>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                        <div className="space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center py-8 space-y-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                                        <Sparkles className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <p className="text-xs text-slate-500 px-4">
                                        Bonjour ! Je suis prêt à vous aider sur la partie <strong>{currentSection?.title}</strong>.
                                        Dites-moi vos idées ou demandez-moi un plan détaillé.
                                    </p>
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[90%] p-3 rounded-xl text-xs shadow-sm ${msg.role === 'user'
                                        ? "bg-blue-600 text-white"
                                        : "bg-white border border-slate-200 text-slate-700 leading-normal"
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isSending && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="p-4 bg-white border-t">
                        <div className="relative">
                            <Textarea
                                placeholder="Parlez à votre mentor..."
                                className="w-full pr-12 min-h-[40px] max-h-[120px] rounded-xl border-slate-200 resize-none py-3 text-xs"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSendMessage()
                                    }
                                }}
                            />
                            <Button
                                className="absolute right-2 bottom-2 h-8 w-8 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-md p-0"
                                onClick={handleSendMessage}
                                disabled={isSending || !newMessage.trim()}
                            >
                                <Send className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
