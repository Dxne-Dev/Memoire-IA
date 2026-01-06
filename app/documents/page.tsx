"use client"

import React, { useState, useEffect } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, Trash2, Plus, FileText } from "lucide-react"
import Link from "next/link"

function formatFileSize(bytes: number) {
  if (!bytes) return ""
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function timeAgo(dateString: string) {
  if (!dateString) return ""
  const now = new Date()
  const date = new Date(dateString)
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return "Il y a quelques secondes"
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} heures`
  if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} jours`
  return date.toLocaleDateString()
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchDocs() {
      try {
        const res = await fetch("/api/user/documents")
        if (!res.ok) throw new Error("Erreur chargement documents")
        const data = await res.json()
        setDocuments(data)
      } catch (e: any) {
        setError(e.message)
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

  if (loading) return <div className="flex items-center justify-center h-screen">Chargement...</div>
  if (error) return <div className="flex items-center justify-center h-screen text-red-600">Erreur : {error}</div>

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex items-center justify-between mb-4 px-6">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-500" />
          <h1 className="text-lg font-bold text-slate-800">Mes Documents</h1>
        </div>
        <Link href="/documents/upload">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg px-5 py-2 flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4 mr-1" />
            Nouveau document
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-2 mb-6 px-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher dans vos documents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          />
          <span className="absolute left-3 top-2.5 text-slate-400"><FileText className="w-5 h-5" /></span>
        </div>
        <Button variant="outline" className="flex items-center gap-2 border-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" /></svg>
          Filtrer
        </Button>
      </div>
      <div className="px-6">
        <h2 className="text-lg font-semibold mb-2">Documents ({filteredDocs.length})</h2>
        {filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-500 bg-white rounded-lg shadow-sm p-8 mt-8">
            <FileText className="w-12 h-12 mb-2 text-blue-400" />
            <div className="mb-2">Prêt à analyser un nouveau document&nbsp;?</div>
            <div className="mb-4 text-sm text-slate-400">Uploadez votre fichier PDF ou DOCX et laissez notre IA l&apos;analyser</div>
            <Link href="/documents/upload">
              <Button variant="outline" className="mt-2">
                <Plus className="w-4 h-4 mr-2" /> Ajouter un document
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="flex items-center bg-white rounded-lg shadow-sm px-4 py-3 gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50">
                  <FileText className="w-7 h-7 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-800 truncate text-base">{doc.title || doc.filename}</span>
                    {doc.status === "Analysé" && <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                    {doc.status === "En cours d'analyse" && <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" /></svg>}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>{doc.type || doc.mimetype || "Fichier"}</span>
                    {doc.size && <span>• {formatFileSize(doc.size)}</span>}
                    <span>• {timeAgo(doc.upload_date)}</span>
                    {doc.ia_score && <span className="text-green-600 font-semibold">Score IA: {doc.ia_score}/100</span>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 min-w-[110px]">
                  <Badge
                    className={
                      doc.status === "Analysé"
                        ? "bg-green-100 text-green-700 border-green-200 px-3 py-1"
                        : doc.status?.toLowerCase().includes("cours")
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200 px-3 py-1"
                          : doc.status === "Terminé"
                            ? "bg-blue-100 text-blue-700 border-blue-200 px-3 py-1"
                            : "bg-slate-100 text-slate-500 border-slate-200 px-3 py-1"
                    }
                  >
                    {doc.status}
                  </Badge>
                  <div className="flex gap-1 mt-1">
                    <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}