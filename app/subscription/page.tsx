"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Crown, Check, X, CreditCard, Calendar, Users, Zap, Star, Gift, ArrowRight } from "lucide-react"
import { useState } from "react"

const plans = [
	{
		id: "premium",
		name: "Premium",
		price: "3000",
		currency: "FCFA",
		period: "mois",
		description: "Pour les utilisateurs exigeants qui veulent tout débloquer.",
		features: [
			"Documents illimités",
			"Analyse IA avancée",
			"Suggestions personnalisées",
			"Support prioritaire",
			"Historique illimité",
			"Export PDF des analyses",
			"Collaboration en équipe",
		],
		limitations: [],
		popular: true,
		current: true,
		discount: "", // Ajouté pour éviter l'erreur
	},
	{
		id: "lifetime",
		name: "Lifetime",
		price: "15000",
		currency: "FCFA",
		period: "à vie",
		description: "Payez une seule fois et profitez de toutes les fonctionnalités pour toujours.",
		features: [
			"Accès illimité à vie",
			"Toutes les fonctionnalités Premium",
			"Support prioritaire",
		],
		limitations: [],
		popular: false,
		current: false,
		discount: "", // Ajouté pour éviter l'erreur
	},
]

const paymentMethods = [
	{
		id: "wave",
		name: "Wave",
		icon: "📱",
		description: "Paiement mobile sécurisé",
	},
	{
		id: "orange",
		name: "Orange Money",
		icon: "🟠",
		description: "Paiement par mobile money",
	},
	{
		id: "free",
		name: "Free Money",
		icon: "🔵",
		description: "Paiement par mobile money",
	},
	{
		id: "card",
		name: "Carte bancaire",
		icon: "💳",
		description: "Visa, Mastercard",
	},
]

const usageStats = {
	documentsUsed: 8,
	documentsLimit: 15,
	analysesUsed: 23,
	analysesLimit: 50,
	storageUsed: 2.4,
	storageLimit: 10,
}

export default function SubscriptionPage() {
	const [selectedPlan, setSelectedPlan] = useState("premium")
	const [selectedPayment, setSelectedPayment] = useState("")
	// Trouver le plan courant
	const currentPlan = plans.find((p) => p.current)

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
				<SidebarTrigger />
				<div className="flex-1">
					<h1 className="text-lg font-semibold text-slate-800">Abonnement</h1>
				</div>
				<Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200">
					<Crown className="w-3 h-3 mr-1" />
					{currentPlan?.name}
				</Badge>
			</header>
			<main className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-blue-50">
				<div className="max-w-3xl mx-auto space-y-8">
					{/* Titre */}
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-slate-800">Choisissez votre abonnement</h2>
						<p className="text-slate-600 mt-2">Passez à Premium ou profitez de l&apos;accès à vie !</p>
					</div>
					{/* Offres dynamiques */}
					<div className="grid md:grid-cols-2 gap-8">
						{plans.map((plan) => (
							<Card
								key={plan.id}
								className={`relative shadow-lg border-2 transition-all duration-200 cursor-pointer ${selectedPlan === plan.id ? "ring-2 ring-blue-500" : ""
									}`}
								onClick={() => setSelectedPlan(plan.id)}
							>
								{plan.popular && (
									<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
										<Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
											<Star className="w-3 h-3 mr-1" />
											Plus populaire
										</Badge>
									</div>
								)}
								{plan.current && (
									<div className="absolute -top-3 right-4">
										<Badge className="bg-green-600 text-white">Actuel</Badge>
									</div>
								)}

								<CardHeader className="text-center pb-4">
									<CardTitle className="text-xl font-semibold text-slate-800">
										{plan.name}
									</CardTitle>
									<div className="space-y-2">
										<div className="flex items-baseline justify-center space-x-1">
											<span className="text-4xl font-bold text-slate-800">
												{plan.price}
											</span>
											<span className="text-slate-600">
												{plan.currency}
											</span>
										</div>
										<div className="text-slate-500">
											par {plan.period}
										</div>
										{plan.discount && (
											<Badge
												variant="outline"
												className="text-green-600 border-green-200"
											>
												<Gift className="w-3 h-3 mr-1" />
												{plan.discount}
											</Badge>
										)}
									</div>
									<p className="text-slate-600">
										{plan.description}
									</p>
								</CardHeader>

								<CardContent className="space-y-4">
									<div className="space-y-3">
										{plan.features.map((feature, index) => (
											<div
												key={index}
												className="flex items-center space-x-3"
											>
												<Check className="w-4 h-4 text-green-500 flex-shrink-0" />
												<span className="text-sm text-slate-700">
													{feature}
												</span>
											</div>
										))}

										{plan.limitations.map((limitation, index) => (
											<div
												key={index}
												className="flex items-center space-x-3"
											>
												<X className="w-4 h-4 text-slate-400 flex-shrink-0" />
												<span className="text-sm text-slate-500">
													{limitation}
												</span>
											</div>
										))}
									</div>

									<Button
										className={`w-full ${plan.current
												? "bg-slate-600 hover:bg-slate-700"
												: plan.popular
													? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
													: "bg-blue-600 hover:bg-blue-700"
											}`}
										disabled={plan.current}
									>
										{plan.current
											? "Plan actuel"
											: `Passer au plan ${plan.name}`}
										{!plan.current && (
											<ArrowRight className="w-4 h-4 ml-2" />
										)}
									</Button>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Payment Methods */}
					{selectedPlan !== "free" &&
						!plans.find((p) => p.id === selectedPlan)?.current && (
							<Card className="border-0 shadow-lg">
								<CardHeader>
									<CardTitle className="text-xl font-semibold text-slate-800">
										Méthode de paiement
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid md:grid-cols-2 gap-4">
										{paymentMethods.map((method) => (
											<div
												key={method.id}
												className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPayment === method.id
														? "border-blue-500 bg-blue-50"
														: "border-slate-200 hover:border-slate-300"
													}`}
												onClick={() => setSelectedPayment(method.id)}
											>
												<div className="flex items-center space-x-3">
													<span className="text-2xl">{method.icon}</span>
													<div>
														<div className="font-medium text-slate-800">
															{method.name}
														</div>
														<div className="text-sm text-slate-600">
															{method.description}
														</div>
													</div>
												</div>
											</div>
										))}
									</div>

									<div className="pt-4 border-t">
										<Button
											size="lg"
											className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
										>
											<CreditCard className="w-5 h-5 mr-2" />
											Confirmer le paiement -{" "}
											{plans.find((p) => p.id === selectedPlan)?.price} FCFA
										</Button>
									</div>
								</CardContent>
							</Card>
						)}

					{/* Benefits */}
					<Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
						<CardContent className="p-8">
							<div className="text-center mb-6">
								<h3 className="text-2xl font-bold text-slate-800 mb-2">
									Pourquoi passer Premium ?
								</h3>
								<p className="text-slate-600">
									Débloquez tout le potentiel de MémoireAI
								</p>
							</div>

							<div className="grid md:grid-cols-3 gap-6">
								<div className="text-center">
									<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
										<Zap className="w-6 h-6 text-purple-600" />
									</div>
									<h4 className="font-semibold text-slate-800 mb-2">
										Analyses illimitées
									</h4>
									<p className="text-sm text-slate-600">
										Analysez autant de documents que vous voulez
									</p>
								</div>

								<div className="text-center">
									<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
										<Users className="w-6 h-6 text-blue-600" />
									</div>
									<h4 className="font-semibold text-slate-800 mb-2">
										Collaboration
									</h4>
									<p className="text-sm text-slate-600">
										Travaillez en équipe sur vos projets
									</p>
								</div>

								<div className="text-center">
									<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
										<Crown className="w-6 h-6 text-green-600" />
									</div>
									<h4 className="font-semibold text-slate-800 mb-2">
										Support prioritaire
									</h4>
									<p className="text-sm text-slate-600">
										Assistance rapide et personnalisée
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	)
}
