"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PenTool, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Veuillez remplir tous les champs")
      return
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) {

        // Connexion réussie, redirige vers le dashboard
        window.location.href = '/dashboard'
      } else {
        setError(data.error || 'Identifiants invalides')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Illustration côté gauche */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-800">MémoireAI</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-800 leading-tight">Bon retour parmi nous !</h1>
            <p className="text-xl text-slate-600">
              Connecte-toi pour continuer ton travail sur ton mémoire avec l&apos;aide de notre IA.
            </p>
          </div>

          {/* Illustration mockup */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Dernière session</h3>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PenTool className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">Mémoire Marketing Digital</div>
                  <div className="text-xs text-slate-500">Modifié il y a 2 heures</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                <div className="text-xs text-slate-600">
                  &quot;Votre conclusion nécessite quelques ajustements. Voulez-vous que je vous aide ?&quot;
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de connexion */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-2 text-center">
              <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <PenTool className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-800">MémoireAI</span>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">Connexion</CardTitle>
              <p className="text-slate-600">Accède à ton espace personnel</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="ton.email@exemple.com"
                      className="pl-10 h-12"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" className="rounded" />
                    <Label htmlFor="remember" className="text-sm text-slate-600">
                      Se souvenir de moi
                    </Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
                >
                  Se connecter
                </Button>
              </form>

              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-2 text-sm text-slate-500">ou</span>
                </div>
              </div>

              <Button variant="outline" className="w-full h-12 border-slate-300 hover:bg-slate-50 bg-transparent">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuer avec Google
              </Button>

              <div className="text-center text-sm text-slate-600">
                Pas encore de compte ?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Créer un compte
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
