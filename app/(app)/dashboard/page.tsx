"use client"

import { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  FileText,
  Brain,
  Clock,
  PenTool,
  ChevronRight,
  Sparkles,
  BookOpen,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { Project } from "@/lib/types/project"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, projectsRes, docsRes] = await Promise.all([
          fetch("/api/user/me"),
          fetch("/api/projects"),
          fetch("/api/user/documents")
        ])

        if (userRes.ok) setUser(await userRes.json())
        if (projectsRes.ok) setProjects(await projectsRes.json())
        if (docsRes.ok) setDocuments(await docsRes.json())
      } catch (error) {
        console.error("Dashboard fetch error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
    </div>
  )

  const latestProject = projects[0]
  const totalProgress = projects.length > 0
    ? Math.round((projects.reduce((acc, p) => acc + p.structure.filter(s => s.status === 'completed').length, 0) /
      projects.reduce((acc, p) => acc + p.structure.length, 0)) * 100)
    : 0

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Header dynamique */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-md sticky top-0 z-20 px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1">
          <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Bonjour, {user?.name || "Étudiant"} ✨
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/projects/new">
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Mémoire
            </Button>
          </Link>
        </div>
      </header>

      <main className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto w-full">
        {/* 1. Hero / Focus Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {latestProject ? (
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-700 to-purple-800 text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <PenTool size={180} />
                </div>
                <CardHeader className="relative z-10 pb-2">
                  <Badge className="w-fit bg-white/20 hover:bg-white/30 border-0 text-white mb-2">
                    En cours de rédaction
                  </Badge>
                  <CardTitle className="text-3xl font-bold leading-tight">
                    {latestProject.title}
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-lg">
                    {latestProject.fieldOfStudy}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end text-sm">
                      <span>Progression du projet</span>
                      <span className="font-bold text-xl">
                        {Math.round((latestProject.structure.filter(s => s.status === 'completed').length / latestProject.structure.length) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(latestProject.structure.filter(s => s.status === 'completed').length / latestProject.structure.length) * 100}
                      className="h-3 bg-white/20"
                      indicatorClassName="bg-white"
                    />
                    <div className="flex gap-4 pt-4">
                      <Link href={`/projects/${latestProject.id}`} className="flex-1">
                        <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold border-0 h-12">
                          Reprendre mon travail
                          <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-xl p-8 text-center bg-white">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Lancez votre premier mémoire</h2>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                  L'IA est prête à devenir votre mentor. Créez un projet pour commencer à co-rédiger.
                </p>
                <Link href="/projects/new">
                  <Button size="lg" className="bg-blue-600 px-8">Commencer maintenant</Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Stats Rapides */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-2">
                <p className="text-xs font-bold text-slate-400 uppercase">Impact Mentor</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                    <Clock />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">~{documents.length * 2}h</p>
                    <p className="text-xs text-slate-500 font-medium">Temps économisé</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                    <Brain />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{documents.length}</p>
                    <p className="text-xs text-slate-500 font-medium">Analyses de sources</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-slate-900 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-slate-400">Total Mémoires</p>
                  <Badge className="bg-slate-800 text-slate-200 border-0">{projects.length}</Badge>
                </div>
                <p className="text-3xl font-bold mb-1">{totalProgress}%</p>
                <p className="text-xs text-slate-400 mb-4">Progression globale</p>
                <Progress value={totalProgress} className="h-1.5 bg-slate-800" indicatorClassName="bg-blue-400" />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 2. Secondary Content SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Projets Récents */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-blue-600" />
                Mes Mémoires
              </h3>
              <Link href="/projects" className="text-xs font-bold text-blue-600 hover:underline">Voir tout</Link>
            </div>
            <div className="space-y-3">
              {projects.slice(0, 3).map((p) => (
                <Link key={p.id} href={`/projects/${p.id}`}>
                  <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm line-clamp-1">{p.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{p.fieldOfStudy}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bibliothèque Récente */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Bibliothèque
              </h3>
              <Link href="/documents" className="text-xs font-bold text-purple-600 hover:underline">Ouvrir</Link>
            </div>
            <div className="space-y-3">
              {documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm line-clamp-1">{doc.title}</p>
                      <p className="text-[10px] text-slate-400">{new Date(doc.upload_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-slate-50">{doc.status}</Badge>
                </div>
              ))}
              <Link href="/documents/upload">
                <Button variant="ghost" className="w-full border-2 border-dashed border-slate-200 h-12 hover:bg-slate-50 hover:border-slate-300 text-slate-500 font-bold">
                  + Ajouter une source
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}