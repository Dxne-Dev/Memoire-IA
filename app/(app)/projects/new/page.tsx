"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, ArrowRight, BookOpen, Sparkles, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function NewProjectPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [field, setField] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [template, setTemplate] = useState<File | null>(null)

    const handleCreate = async () => {
        if (!title) {
            toast.error("Veuillez donner un titre à votre mémoire")
            return
        }

        setIsCreating(true)
        try {
            const formData = new FormData()
            formData.append("title", title)
            formData.append("fieldOfStudy", field)
            if (template) {
                formData.append("file", template)
            }

            const response = await fetch("/api/projects", {
                method: "POST",
                body: formData
            })

            if (!response.ok) throw new Error("Erreur lors de la création")

            const project = await response.json()
            toast.success("Projet créé avec succès !")
            router.push(`/projects/${project.id}`)
        } catch (error) {
            console.error(error)
            toast.error("Impossible de créer le projet")
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col min-h-screen">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold text-slate-800">Démarrer un nouveau mémoire</h1>
                    </header>

                    <main className="flex-1 p-6 bg-slate-50 flex justify-center items-center">
                        <div className="max-w-2xl w-full">
                            <Card className="border-0 shadow-2xl">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-2xl">Initialisez votre projet</CardTitle>
                                    <CardDescription>
                                        Dites-moi sur quoi vous travaillez, et je préparerai votre espace de rédaction.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Titre provisoire du mémoire</Label>
                                            <Input
                                                id="title"
                                                placeholder="Ex: L'impact de l'IA sur le marketing digital..."
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="field">Filière / Domaine d'étude</Label>
                                            <Input
                                                id="field"
                                                placeholder="Ex: Marketing, Informatique, Sociologie..."
                                                value={field}
                                                onChange={(e) => setField(e.target.value)}
                                                className="h-12"
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer group">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    id="template-upload"
                                                    onChange={(e) => setTemplate(e.target.files?.[0] || null)}
                                                />
                                                <label htmlFor="template-upload" className="cursor-pointer space-y-2">
                                                    <Upload className="w-8 h-8 text-slate-400 mx-auto group-hover:text-blue-500 transition-colors" />
                                                    <div className="font-medium text-slate-700">
                                                        {template ? template.name : "Uploader un template (Optionnel)"}
                                                    </div>
                                                    <p className="text-xs text-slate-500">
                                                        Un ancien mémoire de votre filière aidera l'IA à comprendre le style et la structure attendus.
                                                    </p>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            variant="outline"
                                            className="flex-1 h-12"
                                            onClick={() => router.back()}
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                                            onClick={handleCreate}
                                            disabled={isCreating}
                                        >
                                            {isCreating ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Sparkles className="w-4 h-4 mr-2" />
                                            )}
                                            {template ? "Analyser & Créer" : "Créer le projet"}
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
