"use client"

import { useState, useEffect } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenTool, Plus, BookOpen, Clock, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Project } from "@/lib/types/project"

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch("/api/projects")
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || "Erreur lors du chargement");
                }
                const data = await response.json()
                setProjects(data)
            } catch (error: any) {
                console.error(error)
                toast.error(error.message || "Impossible de charger vos projets")
            } finally {
                setIsLoading(false)
            }
        }
        fetchProjects()
    }, [])

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold text-slate-800">Mes Projets de Mémoire</h1>
                </div>
                <Link href="/projects/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md">
                        <Plus className="w-4 h-4 mr-2" />
                        Nouveau Projet
                    </Button>
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 bg-slate-50">
                <div className="max-w-6xl mx-auto space-y-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <p className="mt-4 text-slate-600">Chargement de vos projets...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <Card className="border-0 shadow-lg text-center p-12">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="w-10 h-10 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Aucun projet en cours</h2>
                            <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                Commencez votre aventure académique en créant votre premier projet de mémoire avec l'aide de votre mentor IA.
                            </p>
                            <Link href="/projects/new">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                    Créer mon premier mémoire
                                </Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <Link key={project.id} href={`/projects/${project.id}`}>
                                    <Card className="border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <PenTool className="w-5 h-5" />
                                                </div>
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100">
                                                    {project.structure.length} Sections
                                                </Badge>
                                            </div>
                                            <CardTitle className="mt-4 group-hover:text-blue-600 transition-colors">
                                                {project.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                                                {project.fieldOfStudy || "Filière non spécifiée"}
                                            </p>
                                            <div className="flex items-center justify-between pt-4 border-t text-xs text-slate-400">
                                                <div className="flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Mis à jour {new Date(project.updatedAt).toLocaleDateString()}
                                                </div>
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
