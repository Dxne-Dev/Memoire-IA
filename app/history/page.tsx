"use client"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, FileText, Brain, Upload, Download, Eye, Share2, Search, Filter, Calendar, MoreHorizontal } from "lucide-react"
import { useState, useEffect } from "react"

const historyItems = [
	{
		id: 1,
		type: "question",
		title: "Question IA - Introduction",
		description: "Comment améliorer la transition entre les parties ?",
		timestamp: "2024-11-20T15:20:00",
		details: {
			response: "Suggestion détaillée fournie",
			helpful: true,
		},
	},
	{
		id: 2,
		type: "analysis",
		title: "Analyse IA - Chapitre 2 Méthodologie",
		description: "Analyse terminée avec score 90/100",
		timestamp: "2024-11-20T15:30:00",
		details: {
			score: 90,
			suggestions: 3,
			duration: "1 minute",
		},
	},
	{
		id: 3,
		type: "question",
		title: "Question IA - Méthodologie",
		description: "Comment améliorer la transition entre les parties ?",
		timestamp: "2024-11-20T15:20:00",
		details: {
			response: "Suggestion détaillée fournie",
			helpful: true,
		},
	},
	{
		id: 9,
		type: "download",
		title: "Téléchargement - Rapport d'analyse",
		description: "Export PDF du rapport d'analyse",
		timestamp: "2024-11-20T15:45:00",
		details: {
			format: "PDF",
			pages: 12,
		},
	},
	{
		id: 10,
		type: "upload",
		title: "Upload - Chapitre 1 Introduction",
		description: "Document DOCX uploadé avec succès",
		timestamp: "2024-11-19T10:15:00",
		details: {
			fileName: "chapitre-1-introduction.docx",
			fileSize: "856 KB",
		},
	},
	{
		id: 11,  // Changed from 6 to 11
		type: "analysis",
		title: "Analyse IA - Chapitre 1 Introduction",
		description: "Analyse terminée avec score 85/100",
		timestamp: "2024-11-19T10:20:00",
		details: {
			score: 85,
			suggestions: 5,
			duration: "2 minutes",
		},
	},
	{
		id: 12,  // Changed from 7 to 12
		type: "share",
		title: "Partage - Plan détaillé",
		description: "Document partagé avec marie.prof@univ.sn",
		timestamp: "2024-11-18T16:30:00",
		details: {
			recipient: "marie.prof@univ.sn",
			permissions: "Lecture seule",
		},
	},
	{
		id: 13,  // Changed from 8 to 13
		type: "question",
		title: "Question IA - Méthodologie",
		description: "Quelle méthodologie utiliser pour mon étude ?",
		timestamp: "2024-11-18T14:10:00",
		details: {
			response: "Méthodologie quantitative recommandée",
			helpful: true,
		},
	},
]

const getActionIcon = (type: string) => {
	switch (type) {
		case "upload":
			return <Upload className="w-4 h-4 text-blue-600" />
		case "analysis":
			return <Brain className="w-4 h-4 text-purple-600" />
		case "question":
			return <Brain className="w-4 h-4 text-green-600" />
		case "download":
			return <Download className="w-4 h-4 text-orange-600" />
		case "share":
			return <Share2 className="w-4 h-4 text-pink-600" />
		default:
			return <FileText className="w-4 h-4 text-slate-600" />
	}
}

const getActionColor = (type: string) => {
	switch (type) {
		case "upload":
			return "bg-blue-100 border-blue-200"
		case "analysis":
			return "bg-purple-100 border-purple-200"
		case "question":
			return "bg-green-100 border-green-200"
		case "download":
			return "bg-orange-100 border-orange-200"
		case "share":
			return "bg-pink-100 border-pink-200"
		default:
			return "bg-slate-100 border-slate-200"
	}
}

const formatDate = (timestamp: string) => {
	const date = new Date(timestamp)
	const now = new Date()
	const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

	if (diffInHours < 1) {
		return "Il y a quelques minutes"
	} else if (diffInHours < 24) {
		return `Il y a ${diffInHours}h`
	} else if (diffInHours < 48) {
		return "Hier"
	} else {
		return date.toLocaleDateString("fr-FR", {
			day: "numeric",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
		})
	}
}

export default function HistoryPage() {
	const [history, setHistory] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		setLoading(true)
		fetch("/api/history")
			.then(res => {
				if (!res.ok) throw new Error("Erreur lors du chargement de l&apos;historique")
				return res.json()
			})
			.then(data => setHistory(data))
			.catch(e => setError(e.message))
			.finally(() => setLoading(false))
	}, [])
	const [searchTerm, setSearchTerm] = useState("")
	const [filterType, setFilterType] = useState("all")
	const [filterDate, setFilterDate] = useState("all")

	const filteredHistory = historyItems.filter((item) => {
		const matchesSearch =
			item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.description.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesType = filterType === "all" || item.type === filterType

		let matchesDate = true
		if (filterDate !== "all") {
			const itemDate = new Date(item.timestamp)
			const now = new Date()
			const diffInDays = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24))

			switch (filterDate) {
				case "today":
					matchesDate = diffInDays === 0
					break
				case "week":
					matchesDate = diffInDays <= 7
					break
				case "month":
					matchesDate = diffInDays <= 30
					break
			}
		}

		return matchesSearch && matchesType && matchesDate
	})

	// Group by date
	const groupedHistory = filteredHistory.reduce(
		(groups, item) => {
			const date = new Date(item.timestamp).toLocaleDateString("fr-FR", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})

			if (!groups[date]) {
				groups[date] = []
			}
			groups[date].push(item)
			return groups
		},
		{} as Record<string, typeof historyItems>,
	)

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
				<SidebarTrigger />
				<div className="flex-1">
					<h1 className="text-lg font-semibold text-slate-800 flex items-center">
						Historique
					</h1>
				</div>
				<Badge variant="outline" className="text-slate-600">
					{filteredHistory.length} activités
				</Badge>
			</header>

			{/* Main Content */}
			<main className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-blue-50">
				<div className="max-w-5xl mx-auto space-y-6">
					{/* Filters */}
					<Card className="border-0 shadow-lg">
						<CardContent className="p-6">
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
									<Input
										placeholder="Rechercher dans l&apos;historique..."
										className="pl-10"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
								</div>

								<Select value={filterType} onValueChange={setFilterType}>
									<SelectTrigger className="w-40">
										<Filter className="w-4 h-4 mr-2" />
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Toutes les actions</SelectItem>
										<SelectItem value="upload">Uploads</SelectItem>
										<SelectItem value="analysis">Analyses IA</SelectItem>
										<SelectItem value="question">Questions IA</SelectItem>
										<SelectItem value="download">Téléchargements</SelectItem>
										<SelectItem value="share">Partages</SelectItem>
									</SelectContent>
								</Select>

								<Select value={filterDate} onValueChange={setFilterDate}>
									<SelectTrigger className="w-40">
										<Calendar className="w-4 h-4 mr-2" />
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Toutes les dates</SelectItem>
										<SelectItem value="today">Aujourd&apos;hui</SelectItem>
										<SelectItem value="week">Cette semaine</SelectItem>
										<SelectItem value="month">Ce mois</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>

					{/* History Timeline */}
					{Object.keys(groupedHistory).length === 0 ? (
						<Card className="border-0 shadow-lg">
							<CardContent className="p-12 text-center">
								<Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-slate-600 mb-2">Aucune activité trouvée</h3>
								<p className="text-slate-500">
									{searchTerm || filterType !== "all" || filterDate !== "all"
										? "Essayez de modifier vos filtres de recherche"
										: "Votre historique d&apos;activités apparaîtra ici"}
								</p>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-6">
							{Object.entries(groupedHistory).map(([date, items]) => (
								<Card key={date} className="border-0 shadow-lg">
									<CardHeader className="pb-4">
										<CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
											<Calendar className="w-5 h-5 mr-2" />
											{date}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{items.map((item, index) => (
												<div key={item.id} className="relative">
													{/* Timeline line */}
													{index < items.length - 1 && (
														<div className="absolute left-6 top-12 w-0.5 h-8 bg-slate-200"></div>
													)}

													<div className="flex items-start space-x-4">
														<div
															className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${getActionColor(item.type)}`}
														>
															{getActionIcon(item.type)}
														</div>

														<div className="flex-1 min-w-0">
															<div className="flex items-center justify-between mb-4 px-6">
																{/* SidebarTrigger supprimé */}
																<div className="flex-1">
																	<h4 className="font-medium text-slate-800 mb-1">{item.title}</h4>
																	<p className="text-sm text-slate-600 mb-2">{item.description}</p>

																	{/* Details */}
																	<div className="flex items-center space-x-4 text-xs text-slate-500">
																		<span>{formatDate(item.timestamp)}</span>
																		{item.details && (
																			<>
																				{item.details.fileName && <span>• {item.details.fileName}</span>}
																				{item.details.score && <span>• Score: {item.details.score}/100</span>}
																				{item.details.duration && <span>• {item.details.duration}</span>}
																				{item.details.format && <span>• Format: {item.details.format}</span>}
																			</>
																		)}
																	</div>
																</div>

																<div className="flex items-center space-x-2">
																	<Button variant="ghost" size="sm">
																		<Eye className="w-3 h-3" />
																	</Button>
																	<Button variant="ghost" size="sm">
																		<MoreHorizontal className="w-3 h-3" />
																	</Button>
																</div>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{/* Summary Stats */}
					<Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
						<CardContent className="p-6">
							<h3 className="text-lg font-semibold text-slate-800 mb-4">Résumé de votre activité</h3>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-blue-600">
										{history.filter((item) => item.type === "upload").length}
									</div>
									<div className="text-sm text-slate-600">Documents uploadés</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-purple-600">
										{history.filter((item) => item.type === "analysis").length}
									</div>
									<div className="text-sm text-slate-600">Analyses IA</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">
										{history.filter((item) => item.type === "question").length}
									</div>
									<div className="text-sm text-slate-600">Questions posées</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-orange-600">
										{history.filter((item) => item.type === "download").length}
									</div>
									<div className="text-sm text-slate-600">Téléchargements</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	)
}
