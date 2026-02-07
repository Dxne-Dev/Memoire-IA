"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  FileText,
  Brain,
  TrendingUp,
  TrendingDown,
  Search,
  MoreHorizontal,
  Ban,
  CheckCircle,
  Crown,
  AlertTriangle,
  DollarSign,
  Download,
} from "lucide-react"
import { useState } from "react"

const stats = [
  {
    title: "Utilisateurs totaux",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "blue",
  },
  {
    title: "Documents analysés",
    value: "8,432",
    change: "+23%",
    trend: "up",
    icon: FileText,
    color: "green",
  },
  {
    title: "Analyses IA ce mois",
    value: "2,156",
    change: "+8%",
    trend: "up",
    icon: Brain,
    color: "purple",
  },
  {
    title: "Revenus (FCFA)",
    value: "2,847,000",
    change: "+15%",
    trend: "up",
    icon: DollarSign,
    color: "orange",
  },
]

const recentUsers = [
  {
    id: 1,
    name: "Marie Diallo",
    email: "marie.diallo@exemple.com",
    plan: "Premium",
    status: "active",
    joinDate: "2024-11-15",
    documentsCount: 12,
    lastActive: "Il y a 2h",
  },
  {
    id: 2,
    name: "Amadou Sow",
    email: "amadou.sow@exemple.com",
    plan: "Gratuit",
    status: "active",
    joinDate: "2024-11-18",
    documentsCount: 3,
    lastActive: "Il y a 1j",
  },
  {
    id: 3,
    name: "Fatou Ba",
    email: "fatou.ba@exemple.com",
    plan: "Étudiant",
    status: "suspended",
    joinDate: "2024-11-10",
    documentsCount: 8,
    lastActive: "Il y a 3j",
  },
  {
    id: 4,
    name: "Ousmane Diop",
    email: "ousmane.diop@exemple.com",
    plan: "Premium",
    status: "active",
    joinDate: "2024-11-20",
    documentsCount: 5,
    lastActive: "Il y a 30min",
  },
  {
    id: 5,
    name: "Aïcha Ndiaye",
    email: "aicha.ndiaye@exemple.com",
    plan: "Gratuit",
    status: "inactive",
    joinDate: "2024-11-05",
    documentsCount: 1,
    lastActive: "Il y a 1 semaine",
  },
]

const recentActivity = [
  {
    id: 1,
    type: "signup",
    user: "Khadija Mbaye",
    action: "Nouveau compte créé",
    timestamp: "Il y a 15min",
    details: "Plan Gratuit",
  },
  {
    id: 2,
    type: "upgrade",
    user: "Ibrahima Fall",
    action: "Upgrade vers Premium",
    timestamp: "Il y a 1h",
    details: "3000 FCFA/mois",
  },
  {
    id: 3,
    type: "analysis",
    user: "Mariam Cissé",
    action: "Document analysé",
    timestamp: "Il y a 2h",
    details: "Score: 89/100",
  },
  {
    id: 4,
    type: "support",
    user: "Moussa Sarr",
    action: "Ticket support créé",
    timestamp: "Il y a 3h",
    details: "Problème d'upload",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-700 border-green-200">Actif</Badge>
    case "suspended":
      return <Badge className="bg-red-100 text-red-700 border-red-200">Suspendu</Badge>
    case "inactive":
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Inactif</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getPlanBadge = (plan: string) => {
  switch (plan) {
    case "Premium":
      return (
        <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200">
          <Crown className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      )
    case "Étudiant":
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Étudiant</Badge>
    case "Gratuit":
      return <Badge variant="outline">Gratuit</Badge>
    default:
      return <Badge variant="outline">{plan}</Badge>
  }
}

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])

  const filteredUsers = recentUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUserAction = (userId: number, action: string) => {
    console.log(`Action ${action} for user ${userId}`)
    // Ici on implémenterait les actions admin
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} for users:`, selectedUsers)
    setSelectedUsers([])
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-slate-800">Administration</h1>
            </div>
            <Badge className="bg-red-100 text-red-700 border-red-200">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                          <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        {stat.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                        <span className="text-slate-500 ml-1">ce mois</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Users Management */}
                <div className="lg:col-span-2">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-xl font-semibold text-slate-800">Gestion des utilisateurs</CardTitle>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Exporter
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Search and Actions */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            placeholder="Rechercher un utilisateur..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>

                        {selectedUsers.length > 0 && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBulkAction("suspend")}
                              className="bg-transparent"
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Suspendre ({selectedUsers.length})
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBulkAction("activate")}
                              className="bg-transparent"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Activer ({selectedUsers.length})
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Users List */}
                      <div className="space-y-3">
                        {filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center space-x-4">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUsers([...selectedUsers, user.id])
                                  } else {
                                    setSelectedUsers(selectedUsers.filter((id) => id !== user.id))
                                  }
                                }}
                                className="rounded"
                              />

                              <Avatar className="w-10 h-10">
                                <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={user.name} />
                                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium text-slate-800">{user.name}</h4>
                                  {getPlanBadge(user.plan)}
                                  {getStatusBadge(user.status)}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-slate-500">
                                  <span>{user.email}</span>
                                  <span>• {user.documentsCount} docs</span>
                                  <span>• {user.lastActive}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleUserAction(user.id, user.status === "active" ? "suspend" : "activate")
                                }
                              >
                                {user.status === "active" ? (
                                  <Ban className="w-4 h-4 text-red-600" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-slate-800">Activité récente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity.type === "signup"
                                ? "bg-green-100"
                                : activity.type === "upgrade"
                                  ? "bg-yellow-100"
                                  : activity.type === "analysis"
                                    ? "bg-purple-100"
                                    : "bg-blue-100"
                              }`}
                          >
                            {activity.type === "signup" && <Users className="w-4 h-4 text-green-600" />}
                            {activity.type === "upgrade" && <Crown className="w-4 h-4 text-yellow-600" />}
                            {activity.type === "analysis" && <Brain className="w-4 h-4 text-purple-600" />}
                            {activity.type === "support" && <AlertTriangle className="w-4 h-4 text-blue-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800">{activity.user}</p>
                            <p className="text-sm text-slate-600">{activity.action}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-slate-500">{activity.timestamp}</span>
                              <span className="text-xs text-slate-500">{activity.details}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* System Health */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-slate-800">État du système</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600">Serveur IA</span>
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Opérationnel
                            </Badge>
                          </div>
                          <Progress value={95} className="h-2" />
                          <span className="text-xs text-slate-500">95% de disponibilité</span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600">Base de données</span>
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Opérationnel
                            </Badge>
                          </div>
                          <Progress value={98} className="h-2" />
                          <span className="text-xs text-slate-500">98% de disponibilité</span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600">Stockage</span>
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Attention
                            </Badge>
                          </div>
                          <Progress value={78} className="h-2" />
                          <span className="text-xs text-slate-500">78% utilisé</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Revenue Chart Placeholder */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-800">Revenus mensuels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Graphique des revenus</h3>
                      <p className="text-slate-600">Les données de revenus s&apos;afficheront ici</p>
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
