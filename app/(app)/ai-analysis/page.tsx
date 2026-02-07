"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Brain, Send, FileText, Lightbulb, Copy, ThumbsUp, ThumbsDown, Sparkles, Loader2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

interface Message {
	id: string;
	type: "ai" | "user";
	content: string;
	timestamp: string;
	suggestions?: string[];
}

interface Document {
	id: string;
	title: string;
	status: string;
	analysis_result?: string;
}

export default function AIAnalysisPage() {
	const searchParams = useSearchParams()
	const initialDocId = searchParams.get("docId")

	const [documents, setDocuments] = useState<Document[]>([])
	const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
	const [message, setMessage] = useState("")
	const [messages, setMessages] = useState<Message[]>([])
	const [isTyping, setIsTyping] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const scrollAreaRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const fetchDocuments = async () => {
			try {
				const response = await fetch("/api/user/documents")
				const data = await response.json()
				setDocuments(data)

				if (initialDocId) {
					const doc = data.find((d: Document) => d.id === initialDocId)
					if (doc) setSelectedDocument(doc)
				} else if (data.length > 0) {
					setSelectedDocument(data[0])
				}
			} catch (error) {
				console.error("Failed to fetch documents", error)
				toast.error("Impossible de charger vos documents.")
			} finally {
				setIsLoading(false)
			}
		}
		fetchDocuments()
	}, [initialDocId])

	useEffect(() => {
		if (selectedDocument) {
			// Initialize chat with a welcome message or the existing analysis
			const welcomeMessage: Message = {
				id: "welcome",
				type: "ai",
				content: selectedDocument.analysis_result || "Bonjour ! Je suis votre assistant IA spécialisé dans l'analyse de mémoires. Comment puis-je vous aider avec ce document ?",
				timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
			}
			setMessages([welcomeMessage])
		}
	}, [selectedDocument])

	useEffect(() => {
		// Scroll to bottom when messages change
		if (scrollAreaRef.current) {
			const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
			if (scrollArea) {
				scrollArea.scrollTop = scrollArea.scrollHeight
			}
		}
	}, [messages, isTyping])

	const handleSendMessage = async () => {
		if (!message.trim() || !selectedDocument) return

		const userMessage: Message = {
			id: Date.now().toString(),
			type: "user",
			content: message,
			timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
		}

		setMessages((prev) => [...prev, userMessage])
		const currentMessage = message
		setMessage("")
		setIsTyping(true)

		try {
			const response = await fetch("/api/ai/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: currentMessage,
					documentId: selectedDocument.id,
					history: messages.map(m => ({ role: m.type === "ai" ? "assistant" : "user", content: m.content }))
				})
			})

			const data = await response.json()

			if (data.error) throw new Error(data.error)

			const aiResponse: Message = {
				id: (Date.now() + 1).toString(),
				type: "ai",
				content: data.response,
				timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
				suggestions: data.suggestions || []
			}
			setMessages((prev) => [...prev, aiResponse])
		} catch (error) {
			console.error("Chat error:", error)
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				type: "ai",
				content: "Désolé, une erreur est survenue lors de l'analyse. Veuillez réessayer.",
				timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
			}
			setMessages((prev) => [...prev, errorMessage])
		} finally {
			setIsTyping(false)
		}
	}

	const handleSuggestionClick = (suggestion: string) => {
		setMessage(suggestion)
	}

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
	}

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center bg-slate-50">
				<div className="flex flex-col items-center space-y-4">
					<Loader2 className="h-10 w-10 animate-spin text-blue-600" />
					<p className="text-slate-600 animate-pulse">Chargement de vos analyses...</p>
				</div>
			</div>
		)
	}

	if (documents.length === 0) {
		return (
			<div className="flex flex-col h-screen">
				<header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
					<SidebarTrigger />
					<h1 className="text-lg font-semibold text-slate-800">Analyse IA</h1>
				</header>
				<div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
					<div className="max-w-md w-full text-center space-y-6">
						<div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<FileText className="w-10 h-10 text-blue-600" />
						</div>
						<h2 className="text-2xl font-bold text-slate-800">Aucun document à analyser</h2>
						<p className="text-slate-600">
							Uploadez votre premier document pour commencer l'analyse assistée par intelligence artificielle.
						</p>
						<Button asChild className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700">
							<a href="/documents/upload">Uploader un document</a>
						</Button>
					</div>
				</div>
			</div>
		)
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
				<div className="w-80 border-r bg-white p-4 flex flex-col space-y-4 overflow-hidden">
					<h3 className="font-semibold text-slate-800 mb-1">Documents disponibles</h3>
					<ScrollArea className="flex-1">
						<div className="space-y-2 pr-3">
							{documents.map((doc) => (
								<div
									key={doc.id}
									className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedDocument?.id === doc.id
										? "bg-blue-50 border-blue-200"
										: "hover:bg-slate-50 border-slate-200"
										}`}
									onClick={() => setSelectedDocument(doc)}
								>
									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
											<FileText className="w-4 h-4 text-blue-600" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="font-medium text-slate-800 truncate text-sm">{doc.title}</div>
											<Badge variant={doc.status === "analyzed" ? "default" : "secondary"} className="text-[10px] h-4">
												{doc.status === "analyzed" ? "Analysé" : (doc.status === "uploaded" ? "En cours" : "Erreur")}
											</Badge>
										</div>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>

					<Card className="border-0 bg-gradient-to-r from-purple-50 to-pink-50 shrink-0">
						<CardContent className="p-4">
							<div className="flex items-start space-x-3">
								<div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shrink-0">
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
				<div className="flex-1 flex flex-col bg-slate-50 relative">
					{/* Document Header */}
					<div className="p-4 bg-white border-b sticky top-0 z-10">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
								<Brain className="w-5 h-5 text-white" />
							</div>
							<div className="min-w-0">
								<h2 className="font-semibold text-slate-800 truncate">{selectedDocument?.title || "Sélectionnez un document"}</h2>
								<p className="text-sm text-slate-600">Assistant IA de Mémoire IA</p>
							</div>
						</div>
					</div>

					{/* Messages */}
					<ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
						<div className="space-y-6 max-w-4xl mx-auto pb-4">
							{messages.map((msg) => (
								<div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
									<div className={`max-w-[85%] ${msg.type === "user" ? "order-2" : ""}`}>
										<div
											className={`p-4 rounded-2xl shadow-sm ${msg.type === "user"
												? "bg-blue-600 text-white"
												: "bg-white border border-slate-200 text-slate-800"
												}`}
										>
											<div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>

											{msg.type === "ai" && (
												<div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
													<div className="flex items-center space-x-1">
														<Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600" onClick={() => copyToClipboard(msg.content)}>
															<Copy className="w-3.5 h-3.5" />
														</Button>
														<Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
															<ThumbsUp className="w-3.5 h-3.5" />
														</Button>
														<Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
															<ThumbsDown className="w-3.5 h-3.5" />
														</Button>
													</div>
													<span className="text-[10px] text-slate-400 uppercase font-medium">{msg.timestamp}</span>
												</div>
											)}
										</div>

										{msg.type === "user" && (
											<div className="text-[10px] text-slate-400 mt-1 text-right font-medium uppercase">{msg.timestamp}</div>
										)}

										{msg.type === "ai" && msg.suggestions && msg.suggestions.length > 0 && (
											<div className="mt-3 flex flex-wrap gap-2">
												{msg.suggestions.map((suggestion, index) => (
													<Button
														key={index}
														variant="outline"
														size="sm"
														className="text-xs bg-slate-100/50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all rounded-full h-8"
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
									<div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
										<div className="flex items-center space-x-3">
											<div className="flex space-x-1">
												<div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
												<div
													className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
													style={{ animationDelay: "0.1s" }}
												></div>
												<div
													className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
													style={{ animationDelay: "0.2s" }}
												></div>
											</div>
											<span className="text-xs font-medium text-slate-500 italic">L&apos;IA analyse votre document...</span>
										</div>
									</div>
								</div>
							)}
						</div>
					</ScrollArea>

					{/* Input */}
					<div className="p-4 bg-white border-t mt-auto shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
						<div className="max-w-4xl mx-auto">
							<div className="flex items-center space-x-3">
								<div className="flex-1">
									<Input
										placeholder="Interrogez l'IA sur votre mémoire..."
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
										className="h-11 px-4 rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500"
										disabled={isTyping || !selectedDocument}
									/>
								</div>
								<Button
									onClick={handleSendMessage}
									disabled={!message.trim() || isTyping || !selectedDocument}
									className="bg-blue-600 hover:bg-blue-700 h-11 w-11 rounded-xl shadow-md p-0"
								>
									<Send className="w-4 h-4" />
								</Button>
							</div>

							<div className="flex items-center justify-between mt-2 px-1">
								<span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Appuyez sur Entrée pour envoyer</span>
								<div className="flex items-center space-x-1">
									<Sparkles className="w-2.5 h-2.5 text-purple-500" />
									<span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Expert Académique Actif</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
