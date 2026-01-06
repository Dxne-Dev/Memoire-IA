"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Brain, Send, FileText, Lightbulb, Copy, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react"
import { useState } from "react"

const documents = [
	{ id: 1, title: "Mémoire Marketing Digital", status: "Analysé" },
	{ id: 2, title: "Chapitre 1 - Introduction", status: "En cours" },
	{ id: 3, title: "Plan détaillé", status: "Terminé" },
]

const chatHistory = [
	{
		id: 1,
		type: "ai",
		content:
			"Bonjour ! Je suis votre assistant IA spécialisé dans l'analyse de mémoires. Comment puis-je vous aider aujourd'hui ?",
		timestamp: "10:30",
	},
	{
		id: 2,
		type: "user",
		content: "Peux-tu analyser la structure de mon mémoire sur le marketing digital ?",
		timestamp: "10:31",
	},
	{
		id: 3,
		type: "ai",
		content:
			"Bien sûr ! J'ai analysé votre mémoire sur le marketing digital. Voici mes observations :\n\n**Points forts :**\n• Introduction bien structurée avec une problématique claire\n• Méthodologie détaillée et pertinente\n• Bibliographie riche et récente\n\n**Points à améliorer :**\n• La transition entre les parties 2 et 3 pourrait être plus fluide\n• Ajoutez des exemples concrets dans la partie théorique\n• La conclusion mériterait d'être étoffée avec des perspectives d'avenir",
		timestamp: "10:32",
		suggestions: ["Comment améliorer mes transitions ?", "Quels exemples ajouter ?", "Aide-moi avec la conclusion"],
	},
]

export default function AIAnalysisPage() {
	const [selectedDocument, setSelectedDocument] = useState(documents[0])
	const [message, setMessage] = useState("")
	const [messages, setMessages] = useState(chatHistory)
	const [isTyping, setIsTyping] = useState(false)

	const handleSendMessage = () => {
		if (!message.trim()) return

		const newMessage = {
			id: messages.length + 1,
			type: "user" as const,
			content: message,
			timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
		}

		setMessages((prev) => [...prev, newMessage])
		setMessage("")
		setIsTyping(true)

		// Simulation de réponse IA
		setTimeout(() => {
			const aiResponse = {
				id: messages.length + 2,
				type: "ai" as const,
				content: "Je comprends votre question. Laissez-moi analyser cela pour vous...",
				timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
				suggestions: ["Peux-tu être plus spécifique ?", "Montre-moi un exemple", "Quelles sont les alternatives ?"],
			}
			setMessages((prev) => [...prev, aiResponse])
			setIsTyping(false)
		}, 2000)
	}

	const handleSuggestionClick = (suggestion: string) => {
		setMessage(suggestion)
	}

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
	}

	return (
		<div className="flex flex-col h-screen">
			{/* Header */}
			<header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
				<SidebarTrigger />
				<div className="flex-1">
					<h1 className="text-lg font-semibold text-slate-800">Analyse IA</h1>
				</div>
				<Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
					<Sparkles className="w-3 h-3 mr-1" />
					IA Avancée
				</Badge>
			</header>

			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar Documents */}
				<div className="w-80 border-r bg-white p-4 space-y-4">
					<div>
						<h3 className="font-semibold text-slate-800 mb-3">Documents disponibles</h3>
						<div className="space-y-2">
							{documents.map((doc) => (
								<div
									key={doc.id}
									className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedDocument.id === doc.id
											? "bg-blue-50 border-blue-200"
											: "hover:bg-slate-50 border-slate-200"
										}`}
									onClick={() => setSelectedDocument(doc)}
								>
									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
											<FileText className="w-4 h-4 text-blue-600" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="font-medium text-slate-800 truncate">{doc.title}</div>
											<Badge variant={doc.status === "Analysé" ? "default" : "secondary"} className="text-xs mt-1">
												{doc.status}
											</Badge>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<Card className="border-0 bg-gradient-to-r from-purple-50 to-pink-50">
						<CardContent className="p-4">
							<div className="flex items-start space-x-3">
								<div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
									<Lightbulb className="w-4 h-4 text-white" />
								</div>
								<div>
									<h4 className="font-semibold text-slate-800 text-sm mb-1">Conseil IA</h4>
									<p className="text-xs text-slate-600">
										Posez des questions spécifiques pour obtenir des analyses plus précises !
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Chat Interface */}
				<div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
					{/* Document Header */}
					<div className="p-4 bg-white border-b">
						<div className="flex items-center space-x-3">

							<div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<Brain className="w-5 h-5 text-white" />
							</div>
							<div>
								<h2 className="font-semibold text-slate-800">{selectedDocument.title}</h2>
								<p className="text-sm text-slate-600">Assistant IA • En ligne</p>
							</div>
						</div>
					</div>

					{/* Messages */}
					<ScrollArea className="flex-1 p-4">
						<div className="space-y-4 max-w-4xl mx-auto">
							{messages.map((msg) => (
								<div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
									<div className={`max-w-2xl ${msg.type === "user" ? "order-2" : ""}`}>
										<div
											className={`p-4 rounded-2xl ${msg.type === "user"
													? "bg-blue-600 text-white"
													: "bg-white border border-slate-200 text-slate-800"
												}`}
										>
											<div className="whitespace-pre-wrap">{msg.content}</div>

											{msg.type === "ai" && (
												<div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
													<div className="flex items-center space-x-2">
														<Button variant="ghost" size="sm" onClick={() => copyToClipboard(msg.content)}>
															<Copy className="w-3 h-3" />
														</Button>
														<Button variant="ghost" size="sm">
															<ThumbsUp className="w-3 h-3" />
														</Button>
														<Button variant="ghost" size="sm">
															<ThumbsDown className="w-3 h-3" />
														</Button>
													</div>
													<span className="text-xs text-slate-400">{msg.timestamp}</span>
												</div>
											)}
										</div>

										{msg.type === "user" && (
											<div className="text-xs text-slate-500 mt-1 text-right">{msg.timestamp}</div>
										)}

										{msg.type === "ai" && msg.suggestions && (
											<div className="mt-3 space-y-2">
												<div className="text-xs text-slate-500 mb-2">Suggestions :</div>
												{msg.suggestions.map((suggestion, index) => (
													<Button
														key={index}
														variant="outline"
														size="sm"
														className="mr-2 mb-2 text-xs bg-transparent"
														onClick={() => handleSuggestionClick(suggestion)}
													>
														{suggestion}
													</Button>
												))}
											</div>
										)}
									</div>
								</div>
							))}

							{isTyping && (
								<div className="flex justify-start">
									<div className="bg-white border border-slate-200 rounded-2xl p-4">
										<div className="flex items-center space-x-2">
											<div className="flex space-x-1">
												<div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
												<div
													className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
													style={{ animationDelay: "0.1s" }}
												></div>
												<div
													className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
													style={{ animationDelay: "0.2s" }}
												></div>
											</div>
											<span className="text-sm text-slate-500">L&apos;IA réfléchit...</span>
										</div>
									</div>
								</div>
							)}
						</div>
					</ScrollArea>

					{/* Input */}
					<div className="p-4 bg-white border-t">
						<div className="max-w-4xl mx-auto">
							<div className="flex items-end space-x-3">
								<div className="flex-1">
									<Input
										placeholder="Posez votre question sur le document..."
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
										className="min-h-[44px] resize-none"
									/>
								</div>
								<Button
									onClick={handleSendMessage}
									disabled={!message.trim() || isTyping}
									className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-11"
								>
									<Send className="w-4 h-4" />
								</Button>
							</div>

							<div className="flex items-center justify-between mt-2 text-xs text-slate-500">
								<span>Appuyez sur Entrée pour envoyer</span>
								<span>IA spécialisée en rédaction académique</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
