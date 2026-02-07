"use client"

import React, { useState, useEffect } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Eye,
  Trash2,
  Plus,
  FileText,
  Search,
  Filter,
  MoreVertical,
  Library,
  Loader2,
  BookOpen
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

function formatFileSize(bytes: number) {
  if (!bytes) return ""
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function LibraryPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchDocs() {
      try {
        const res = await fetch("/api/user/documents")
        if (!res.ok) throw new Error("Erreur chargement documents")
        const data = await res.json()
        setDocuments(data)
      } catch (e: any) {
        toast.error("Impossible de charger la bibliothèque")
      } finally {
        setLoading(false)
      }
    }
    fetchDocs()
  }, [])

  const filteredDocs = documents.filter(doc =>
    doc.title?.toLowerCase().includes(search.toLowerCase()) ||
    doc.filename?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Library Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6 sticky top-0 z-20">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1 flex items-center gap-2">
          <Library className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-bold text-slate-800">Ma Bibliothèque</h1>
        </div>
        <Link href="/documents/upload">
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Ajouter une source</span>
          </Button>
        </Link>
      </header>

      <main className="p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Search & Stats Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher une source, un auteur, un mot-clé..."
              className="pl-10 h-11 bg-white border-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 px-5 border-slate-200 bg-white">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="mt-4 text-slate-500 font-medium">Récupération de vos sources...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <Card className="border-2 border-dashed border-slate-200 bg-transparent py-20 text-center shadow-none">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Votre bibliothèque est vide</h3>
            <p className="text-slate-500 mt-2 mb-8 max-w-xs mx-auto">
              Uploadez vos articles de recherche et vos PDF pour que le mentor puisse les utiliser.
            </p>
            <Link href="/documents/upload">
              <Button className="bg-blue-600">Uploader ma première source</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-blue-100 transition-all group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                    <FileText size={24} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 truncate pr-4">{doc.title || doc.filename}</h4>
                    <div className="flex items-center gap-3 mt-1 underline-offset-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {doc.mimetype?.split('/')[1] || "PDF"}
                      </span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span className="text-xs text-slate-500">
                        {formatFileSize(doc.size)}
                      </span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span className="text-xs text-slate-500">
                        Ajouté le {new Date(doc.upload_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  <Badge
                    variant="secondary"
                    className={`hidden sm:inline-flex text-[10px] font-bold px-2.5 py-0.5 rounded-full ${doc.status === 'Analysé' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-500'
                      }`}
                  >
                    {doc.status}
                  </Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-600">
                      <Eye size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-600">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400">
                    <MoreVertical size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}