"use client"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Moon, Sun, Bell, Shield, Brain, Download, Trash2, AlertTriangle, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    language: "fr",
    emailNotifications: true,
    pushNotifications: true,
    analysisComplete: true,
    weeklyReport: false,
    analysisDepth: "detailed",
    suggestionsFrequency: "high",
    aiTone: "professional",
    autoAnalysis: true,
    dataSharing: false,
    analyticsTracking: true,
    profileVisibility: "private",
  })

  // Synchronise le switch avec le thème actuel
  const [darkSwitch, setDarkSwitch] = useState(false)
  useEffect(() => {
    setDarkSwitch(theme === 'dark')
  }, [theme])

  // Change le thème globalement et sauvegarde la préférence
  const handleDarkModeChange = async (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
    setDarkSwitch(checked)
    try {
      await fetch('/api/user/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: checked ? 'dark' : 'light' })
      })
    } catch { }
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Sauvegarder les paramètres
    console.log("Settings saved:", settings)
  }

  const handleExportData = () => {
    // Exporter les données
    console.log("Exporting data...")
  }

  const handleDeleteAccount = () => {
    // Supprimer le compte
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      console.log("Account deletion requested")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-slate-800 flex items-center">
            Paramètres
          </h1>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Appearance */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center">
                <Sun className="w-5 h-5 mr-2" />
                Apparence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Mode sombre</Label>
                  <p className="text-sm text-slate-600">Basculer entre le thème clair et sombre</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-slate-400" />
                  <Switch
                    checked={darkSwitch}
                    onCheckedChange={handleDarkModeChange}
                  />
                  <Moon className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Langue</Label>
                  <p className="text-sm text-slate-600">Choisir la langue de l&apos;interface</p>
                </div>
                <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Notifications par email</Label>
                  <p className="text-sm text-slate-600">Recevoir des notifications par email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Notifications push</Label>
                  <p className="text-sm text-slate-600">Notifications dans le navigateur</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Analyse terminée</Label>
                  <p className="text-sm text-slate-600">Notification quand l&apos;analyse IA est terminée</p>
                </div>
                <Switch
                  checked={settings.analysisComplete}
                  onCheckedChange={(checked) => handleSettingChange("analysisComplete", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Rapport hebdomadaire</Label>
                  <p className="text-sm text-slate-600">Résumé de votre activité chaque semaine</p>
                </div>
                <Switch
                  checked={settings.weeklyReport}
                  onCheckedChange={(checked) => handleSettingChange("weeklyReport", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Preferences */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Préférences IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Profondeur d&apos;analyse</Label>
                  <p className="text-sm text-slate-600">Niveau de détail des analyses IA</p>
                </div>
                <Select
                  value={settings.analysisDepth}
                  onValueChange={(value) => handleSettingChange("analysisDepth", value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basique</SelectItem>
                    <SelectItem value="detailed">Détaillée</SelectItem>
                    <SelectItem value="comprehensive">Complète</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Fréquence des suggestions</Label>
                  <p className="text-sm text-slate-600">À quelle fréquence recevoir des suggestions</p>
                </div>
                <Select
                  value={settings.suggestionsFrequency}
                  onValueChange={(value) => handleSettingChange("suggestionsFrequency", value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Tonalité de l&apos;IA</Label>
                  <p className="text-sm text-slate-600">Style de communication de l&apos;assistant</p>
                </div>
                <Select value={settings.aiTone} onValueChange={(value) => handleSettingChange("aiTone", value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Amical</SelectItem>
                    <SelectItem value="professional">Professionnel</SelectItem>
                    <SelectItem value="academic">Académique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Analyse automatique</Label>
                  <p className="text-sm text-slate-600">Analyser automatiquement les nouveaux documents</p>
                </div>
                <Switch
                  checked={settings.autoAnalysis}
                  onCheckedChange={(checked) => handleSettingChange("autoAnalysis", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Confidentialité et Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Partage de données</Label>
                  <p className="text-sm text-slate-600">Partager des données anonymisées pour améliorer l&apos;IA</p>
                </div>
                <Switch
                  checked={settings.dataSharing}
                  onCheckedChange={(checked) => handleSettingChange("dataSharing", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Suivi analytique</Label>
                  <p className="text-sm text-slate-600">Permettre le suivi pour améliorer l&apos;expérience</p>
                </div>
                <Switch
                  checked={settings.analyticsTracking}
                  onCheckedChange={(checked) => handleSettingChange("analyticsTracking", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Visibilité du profil</Label>
                  <p className="text-sm text-slate-600">Qui peut voir votre profil</p>
                </div>
                <Select
                  value={settings.profileVisibility}
                  onValueChange={(value) => handleSettingChange("profileVisibility", value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Privé</SelectItem>
                    <SelectItem value="friends">Amis</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="w-full justify-start bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter mes données
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDeleteAccount}
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer mon compte
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800">Sécurité du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" placeholder="••••••••" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" placeholder="••••••••" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">Changer le mot de passe</Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-0 shadow-lg border-red-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-red-600 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Zone de danger
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Supprimer définitivement le compte</h4>
                <p className="text-sm text-red-600 mb-4">
                  Cette action est irréversible. Toutes vos données, documents et analyses seront définitivement
                  supprimés.
                </p>
                <Button variant="destructive" onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer définitivement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
