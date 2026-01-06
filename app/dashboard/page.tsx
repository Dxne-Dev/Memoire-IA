"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, FileText, Brain, Clock, TrendingUp, Upload, MessageSquare } from "lucide-react"
import Link from "next/link"

// --- Dashboard dynamique ---

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // --- Calculs dynamiques pour les stats ---
  const analysedCount = documents.filter((doc) => doc.status === "Analysé").length
  const totalDocs = documents.length
  const iaCount = analysedCount || Math.floor(totalDocs * 0.7) // Simulation si aucun
  const hoursSaved = analysedCount * 2 // 2h par doc analysé (simulation)
  const progress = totalDocs > 0 ? Math.round((analysedCount / totalDocs) * 100) : 0

  // Suggestions IA simulées
  const aiSuggestions = [
    {
      type: "Amélioration",
      message: "Ajoutez un résumé à vos documents pour une analyse plus rapide.",
      priority: "medium",
    },
    {
      type: "Sécurité",
      message: "Pensez à anonymiser les données sensibles avant l&apos;upload.",
      priority: "high",
    },
    {
      type: "Organisation",
      message: "Classez vos documents par catégorie pour mieux les retrouver.",
      priority: "low",
    },
  ]

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await fetch("/api/user/me")
        if (!userRes.ok) throw new Error("Utilisateur non authentifié")
        const userData = await userRes.json()
        setUser(userData)
        const docsRes = await fetch("/api/user/documents")
        if (!docsRes.ok) throw new Error("Erreur chargement documents")
        const docsData = await docsRes.json()
        setDocuments(docsData)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  if (loading) return <div className="flex items-center justify-center h-screen">Chargement...</div>
  if (error) return <div className="flex items-center justify-center h-screen text-red-600">Erreur : {error}</div>

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-slate-800">Bienvenue, {user?.name || user?.email}</h1>
        </div>
        <Link href="/documents/upload">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau document
          </Button>
        </Link>
        <Button variant="outline" className="ml-2 border-red-500 text-red-600 hover:bg-red-50" onClick={handleLogout}>Se déconnecter</Button>
      </header>

      {/* Grille de stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 max-w-6xl mx-auto w-full">
        {/* Documents */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Documents</p>
                <p className="text-2xl font-bold text-slate-800">{totalDocs}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">{totalDocs > 0 ? `+${totalDocs}` : '+0'} ce mois</span>
            </div>
          </CardContent>
        </Card>
        {/* Analyses IA */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Analyses IA</p>
                <p className="text-2xl font-bold text-slate-800">{iaCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+{iaCount} cette semaine</span>
            </div>
          </CardContent>
        </Card>
        {/* Temps économisé */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Temps économisé</p>
                <p className="text-2xl font-bold text-slate-800">{hoursSaved}h</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-slate-500">Ce mois-ci</span>
            </div>
          </CardContent>
        </Card>
        {/* Progression */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Progression</p>
                <p className="text-2xl font-bold text-slate-800">{progress}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section principale : 2 colonnes */}
      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
        {/* Documents récents à gauche */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-slate-800">Documents récents</CardTitle>
              <Link href="/documents">
                <Button variant="outline" size="sm">Voir tout</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {documents.length === 0 ? (
                <div className="text-slate-500">Aucun document trouvé.</div>
              ) : (
                documents.slice(0, 6).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{doc.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={
                            doc.status === "Analysé"
                              ? "default"
                              : doc.status === "En cours"
                                ? "secondary"
                                : "outline"
                          } className="text-xs">
                            {doc.status}
                          </Badge>
                          <span className="text-xs text-slate-500">{doc.upload_date ? new Date(doc.upload_date).toLocaleDateString() : ""}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-800">{doc.progress || 0}%</div>
                      <Progress value={doc.progress || 0} className="w-20 h-2 mt-1" />
                    </div>
                  </div>
                ))
              )}
              <Link href="/ai-analysis">
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Discuter avec l&apos;IA
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        {/* Suggestions IA ou autre contenu à droite (optionnel) */}
      </div>

      {/* Actions rapides */}
      <div className="max-w-6xl mx-auto w-full mt-10">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/documents/upload">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-200 bg-transparent"
                >
                  <Upload className="w-6 h-6 text-blue-600" />
                  <span>Uploader un document</span>
                </Button>
              </Link>
              <Link href="/ai-analysis">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-200 bg-transparent"
                >
                  <Brain className="w-6 h-6 text-purple-600" />
                  <span>Analyse IA</span>
                </Button>
              </Link>
              <Link href="/history">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-200 bg-transparent"
                >
                  <Clock className="w-6 h-6 text-green-600" />
                  <span>Voir l&apos;historique</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Fin du contenu principal */}
    </div>
  );
}