"use client"

import React from "react"
import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Mail, MapPin, Calendar, Upload, Save, Crown, Trophy, Target, BookOpen, Clock } from "lucide-react"
import { useState } from "react"




export default function ProfilePage() {
	// Stats utilisateur dynamiques
	const [userDocs, setUserDocs] = useState<any[]>([]);
	const [stats, setStats] = useState([
		{ label: "Documents uploadés", value: "0", icon: BookOpen },
		{ label: "Analyses IA", value: "0", icon: Target },
		{ label: "Temps économisé", value: "0h", icon: Clock },
		{ label: "Score moyen", value: "-", icon: Trophy },
	]);
	// Réalisations dynamiques
	const [achievements, setAchievements] = useState<any[]>([]);
	React.useEffect(() => {
		async function fetchDocs() {
			try {
				const res = await fetch("/api/user/documents");
				if (!res.ok) throw new Error("Erreur chargement documents");
				const docs = await res.json();
				setUserDocs(docs);
				// Calculs dynamiques
				const uploaded = docs.length;
				const analysed = docs.filter((d: any) => d.status === "Analysé").length;
				const hoursSaved = analysed * 2; // ex: 2h par analyse
				const scores = docs.map((d: any) => d.ia_score).filter((n: any) => typeof n === 'number');
				const avgScore = scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : null;
				setStats([
					{ label: "Documents uploadés", value: String(uploaded), icon: BookOpen },
					{ label: "Analyses IA", value: String(analysed), icon: Target },
					{ label: "Temps économisé", value: hoursSaved + "h", icon: Clock },
					{ label: "Score moyen", value: avgScore !== null ? avgScore + "/100" : "-", icon: Trophy },
				]);
				// Réalisations dynamiques
				const achs = [
					{
						id: 1,
						title: "Nouvel utilisateur",
						description: "Bienvenue sur la plateforme !",
						icon: User,
						unlocked: true,
						date: new Date().toLocaleDateString(),
					},
					{
						id: 2,
						title: "Premier document",
						description: "Vous avez uploadé votre premier document",
						icon: BookOpen,
						unlocked: uploaded > 0,
						date: uploaded > 0 ? (docs[0]?.createdAt ? new Date(docs[0].createdAt).toLocaleDateString() : undefined) : undefined,
					},
					{
						id: 3,
						title: "Analyste débutant",
						description: "5 documents analysés avec succès",
						icon: Target,
						unlocked: analysed >= 5,
						progress: analysed >= 5 ? undefined : Math.round((analysed / 5) * 100),
					},
					{
						id: 4,
						title: "Utilisateur actif",
						description: "Connecté 7 jours consécutifs",
						icon: Trophy,
						unlocked: false, // À implémenter si on a l'info
						progress: undefined,
					},
				];
				setAchievements(achs);
			} catch { }
		}
		fetchDocs();
	}, []);


	React.useEffect(() => {
		async function fetchDocs() {
			try {
				const res = await fetch("/api/user/documents");
				if (!res.ok) throw new Error("Erreur chargement documents");
				const docs = await res.json();
				setUserDocs(docs);
				// Calculs dynamiques
				const uploaded = docs.length;
				const analysed = docs.filter((d: any) => d.status === "Analysé").length;
				const hoursSaved = analysed * 2; // ex: 2h par analyse
				const scores = docs.map((d: any) => d.ia_score).filter((n: any) => typeof n === 'number');
				const avgScore = scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : null;
				setStats([
					{ label: "Documents uploadés", value: String(uploaded), icon: BookOpen },
					{ label: "Analyses IA", value: String(analysed), icon: Target },
					{ label: "Temps économisé", value: hoursSaved + "h", icon: Clock },
					{ label: "Score moyen", value: avgScore !== null ? avgScore + "/100" : "-", icon: Trophy },
				]);
			} catch { }
		}
		fetchDocs();
	}, []);

	// Handler déconnexion pour le profil
	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST" })
		window.location.href = "/login"
	}
	const [isEditing, setIsEditing] = useState(false)
	const [formData, setFormData] = useState<any | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [saveMessage, setSaveMessage] = useState<string | null>(null)

	// Charger les infos utilisateur
	React.useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch("/api/user/me")
				if (!res.ok) throw new Error("Erreur utilisateur")
				const user = await res.json()
				setFormData(user)
			} catch (e: any) {
				setError(e.message)
			} finally {
				setLoading(false)
			}
		}
		fetchUser()
	}, [])

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev: any) => ({ ...prev, [field]: value }))
	}

	const handleSave = async () => {
		setIsEditing(false)
		setSaveMessage(null)
		try {
			const res = await fetch("/api/user/update", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			})
			if (!res.ok) throw new Error("Erreur lors de la sauvegarde")
			setSaveMessage("Profil mis à jour !")
		} catch (e: any) {
			setSaveMessage(e.message)
		}
	}

	if (loading) return <div className="flex items-center justify-center h-screen">Chargement...</div>
	if (error) return <div className="flex items-center justify-center h-screen text-red-600">Erreur : {error}</div>
	if (!formData) return null

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
				<SidebarTrigger />
				<div className="flex-1">
					<h1 className="text-lg font-semibold text-slate-800">Mon Profil</h1>
				</div>
				<Button
					variant="outline"
					className="mr-2 border-red-500 text-red-600 hover:bg-red-50"
					onClick={handleLogout}
				>
					Se déconnecter
				</Button>
				<Button
					onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
					className={
						isEditing
							? "bg-green-600 hover:bg-green-700"
							: "bg-blue-600 hover:bg-blue-700"
					}
				>
					{isEditing ? (
						<>
							<Save className="w-4 h-4 mr-2" />
							Sauvegarder
						</>
					) : (
						<>
							<User className="w-4 h-4 mr-2" />
							Modifier
						</>
					)}
				</Button>
			</header>

			{/* Main Content */}
			<main className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-blue-50">
				<div className="max-w-6xl mx-auto space-y-6">
					{/* Profile Header */}
					<Card className="border-0 shadow-lg">
						<CardContent className="p-8">
							<div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
								<div className="relative">
									<Avatar className="w-24 h-24">
										<AvatarImage
											src="/placeholder.svg?height=96&width=96"
											alt="Marie Diallo"
										/>
										<AvatarFallback className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
											MD
										</AvatarFallback>
									</Avatar>
									{isEditing && (
										<Button
											size="sm"
											className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
										>
											<Upload className="w-4 h-4" />
										</Button>
									)}
								</div>

								<div className="flex-1">
									<div className="flex items-center space-x-3 mb-2">
										<h2 className="text-2xl font-bold text-slate-800">
											{formData.name}
										</h2>
										<Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200">
											<Crown className="w-3 h-3 mr-1" />
											Premium
										</Badge>
									</div>
									<div className="space-y-1 text-slate-600">
										<div className="flex items-center space-x-2">
											<Mail className="w-4 h-4" />
											<span>{formData.email}</span>
										</div>
										<div className="flex items-center space-x-2">
											<MapPin className="w-4 h-4" />
											<span>{formData.location}</span>
										</div>
										<div className="flex items-center space-x-2">
											<Calendar className="w-4 h-4" />
											<span>Membre depuis novembre 2024</span>
										</div>
									</div>
								</div>

								<div className="text-center">
									<div className="text-2xl font-bold text-blue-600">87</div>
									<div className="text-sm text-slate-600">Score IA moyen</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="grid lg:grid-cols-3 gap-6">
						{/* Personal Information */}
						<div className="lg:col-span-2 space-y-6">
							<Card className="border-0 shadow-lg">
								<CardHeader>
									<CardTitle className="text-xl font-semibold text-slate-800">
										Informations personnelles
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="name">Nom complet</Label>
											<Input
												id="name"
												value={formData.name ?? ''}
												onChange={(e) =>
													handleInputChange("name", e.target.value)
												}
												disabled={!isEditing}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="email">Email</Label>
											<Input
												id="email"
												type="email"
												value={formData.email ?? ''}
												onChange={(e) =>
													handleInputChange("email", e.target.value)
												}
												disabled={!isEditing}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="phone">Téléphone</Label>
											<Input
												id="phone"
												value={formData.phone ?? ''}
												onChange={(e) =>
													handleInputChange("phone", e.target.value)
												}
												disabled={!isEditing}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="location">Localisation</Label>
											<Input
												id="location"
												value={formData.location ?? ''}
												onChange={(e) =>
													handleInputChange("location", e.target.value)
												}
												disabled={!isEditing}
											/>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Academic Information */}
							<Card className="border-0 shadow-lg">
								<CardHeader>
									<CardTitle className="text-xl font-semibold text-slate-800">
										Informations académiques
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="university">Université</Label>
											<Input
												id="university"
												value={formData.university}
												onChange={(e) =>
													handleInputChange("university", e.target.value)
												}
												disabled={!isEditing}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="level">Niveau d&apos;études</Label>
											<Input
												id="level"
												value={formData.level}
												onChange={(e) =>
													handleInputChange("level", e.target.value)
												}
												disabled={!isEditing}
											/>
										</div>
										<div className="space-y-2 md:col-span-2">
											<Label htmlFor="field">Domaine d&apos;études</Label>
											<Input
												id="field"
												value={formData.field}
												onChange={(e) =>
													handleInputChange("field", e.target.value)
												}
												disabled={!isEditing}
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="bio">Biographie</Label>
										<Textarea
											id="bio"
											value={formData.bio}
											onChange={(e) =>
												handleInputChange("bio", e.target.value)
											}
											disabled={!isEditing}
											rows={4}
											placeholder="Parlez-nous de vous, vos objectifs académiques..."
										/>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Stats & Achievements */}
						<div className="space-y-6">
							{/* Statistics */}
							<Card className="border-0 shadow-lg">
								<CardHeader>
									<CardTitle className="text-xl font-semibold text-slate-800">
										Statistiques
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{stats.map((stat, index) => (
										<div
											key={index}
											className="flex items-center justify-between"
										>
											<div className="flex items-center space-x-3">
												<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
													<stat.icon className="w-4 h-4 text-blue-600" />
												</div>
												<span className="text-sm text-slate-600">
													{stat.label}
												</span>
											</div>
											<span className="font-semibold text-slate-800">
												{stat.value}
											</span>
										</div>
									))}
								</CardContent>
							</Card>

							{/* Achievements */}
							<Card className="border-0 shadow-lg">
								<CardHeader>
									<CardTitle className="text-xl font-semibold text-slate-800">
										Réalisations
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{achievements.map((achievement) => (
										<div
											key={achievement.id}
											className={`p-3 rounded-lg border ${achievement.unlocked
													? "bg-green-50 border-green-200"
													: "bg-slate-50 border-slate-200"
												}`}
										>
											<div className="flex items-start space-x-3">
												<div
													className={`w-8 h-8 rounded-lg flex items-center justify-center ${achievement.unlocked
															? "bg-green-100"
															: "bg-slate-100"
														}`}
												>
													<achievement.icon
														className={`w-4 h-4 ${achievement.unlocked
																? "text-green-600"
																: "text-slate-400"
															}`}
													/>
												</div>
												<div className="flex-1">
													<h4 className="font-medium text-slate-800">
														{achievement.title}
													</h4>
													<p className="text-sm text-slate-600">
														{achievement.description}
													</p>
													{achievement.unlocked ? (
														<p className="text-xs text-green-600 mt-1">
															Débloqué le {achievement.date}
														</p>
													) : (
														<div className="mt-2">
															<Progress
																value={achievement.progress}
																className="h-2"
															/>
															<p className="text-xs text-slate-500 mt-1">
																{achievement.progress}% complété
															</p>
														</div>
													)}
												</div>
											</div>
										</div>
									))}
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
