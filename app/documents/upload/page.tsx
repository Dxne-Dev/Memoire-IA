"use client"

import type React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, X, CheckCircle, AlertCircle, ArrowLeft, Cloud } from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = droppedFiles.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )

    setFiles((prev) => [...prev, ...validFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    // Simulation d'upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            window.location.href = "/documents"
          }, 1000)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
            <SidebarTrigger className="-ml-1" />
            <Link href="/documents">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-slate-800">Nouveau Document</h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Upload Zone */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-800">Uploader votre document</CardTitle>
                  <p className="text-slate-600">Déposez votre fichier PDF ou DOCX pour commencer l&apos;analyse IA</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Drag & Drop Zone */}
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive
                        ? "border-blue-400 bg-blue-50"
                        : "border-slate-300 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.docx"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                        <Cloud className="w-8 h-8 text-blue-600" />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Déposez vos fichiers ici</h3>
                        <p className="text-slate-600 mb-4">ou cliquez pour sélectionner depuis votre ordinateur</p>
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-4 h-4 mr-2" />
                          Choisir des fichiers
                        </Button>
                      </div>

                      <div className="text-sm text-slate-500">
                        Formats acceptés: PDF, DOCX • Taille max: 10 MB par fichier
                      </div>
                    </div>
                  </div>

                  {/* Selected Files */}
                  {files.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-800">Fichiers sélectionnés</h4>
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">{file.name}</div>
                              <div className="text-sm text-slate-500">{formatFileSize(file.size)}</div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Document Details */}
              {files.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-slate-800">Détails du document</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre du document</Label>
                      <Input
                        id="title"
                        placeholder="Ex: Mémoire Marketing Digital - Chapitre 1"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optionnel)</Label>
                      <Textarea
                        id="description"
                        placeholder="Ajoutez une description pour mieux organiser vos documents..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upload Progress */}
              {uploading && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-800">Upload en cours...</span>
                        <span className="text-sm text-slate-600">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                      {uploadProgress === 100 && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Upload terminé ! Redirection en cours...
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              {files.length > 0 && !uploading && (
                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => setFiles([])}>
                    Annuler
                  </Button>
                  <Button
                    onClick={handleUpload}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    disabled={files.length === 0}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Uploader et analyser
                  </Button>
                </div>
              )}

              {/* Tips */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Conseils pour une meilleure analyse</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Assurez-vous que votre document est bien structuré avec des titres clairs</li>
                        <li>• Les documents de plus de 5 pages donnent de meilleurs résultats d&apos;analyse</li>
                        <li>• Évitez les documents scannés, privilégiez les fichiers texte natifs</li>
                        <li>• L&apos;analyse peut prendre quelques minutes selon la taille du document</li>
                      </ul>
                    </div>
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
