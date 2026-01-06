"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Search, PenTool, FolderOpen, Star, ChevronDown, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const testimonials = [
  {
    name: "Marie Diallo",
    role: "Master 2 Gestion",
    content: "Grâce à cette IA, j'ai structuré mon mémoire en 2 semaines au lieu de 2 mois !",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Amadou Sow",
    role: "Licence 3 Informatique",
    content: "Les questions guidées m'ont aidé à clarifier ma problématique dès le début.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Fatou Ba",
    role: "Master 1 Marketing",
    content: "Interface intuitive et résultats impressionnants. Je recommande !",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const faqs = [
  {
    question: "Comment l'IA analyse-t-elle mon document ?",
    answer:
      "Notre IA utilise des algorithmes avancés pour comprendre la structure de votre mémoire, identifier les points clés et vous proposer des améliorations personnalisées.",
  },
  {
    question: "Mes documents sont-ils sécurisés ?",
    answer:
      "Absolument ! Tous vos documents sont chiffrés et stockés de manière sécurisée. Nous ne partageons jamais vos données avec des tiers.",
  },
  {
    question: "Puis-je utiliser le service gratuitement ?",
    answer:
      "Oui ! Nous offrons un plan gratuit avec des fonctionnalités limitées. Vous pouvez analyser jusqu'à 3 documents par mois.",
  },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">MémoireAI</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">
                Fonctionnalités
              </Link>
              <Link href="#testimonials" className="text-slate-600 hover:text-blue-600 transition-colors">
                Témoignages
              </Link>
              <Link href="#faq" className="text-slate-600 hover:text-blue-600 transition-colors">
                FAQ
              </Link>
              <Button asChild variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
                <Link href="/login">
                  Connexion
                </Link>
              </Button>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <Link href="#features" className="block py-2 text-slate-600">
                Fonctionnalités
              </Link>
              <Link href="#testimonials" className="block py-2 text-slate-600">
                Témoignages
              </Link>
              <Link href="#faq" className="block py-2 text-slate-600">
                FAQ
              </Link>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/login" className="block py-2">
                  Connexion
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
                  🚀 Nouveau : IA spécialisée pour étudiants
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-slate-800 leading-tight">
                  Rédige ton mémoire{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    sans pression
                  </span>{" "}
                  grâce à l&apos;IA
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Notre intelligence artificielle t&apos;accompagne étape par étape dans la rédaction de ton mémoire. Analyse
                  intelligente, questions guidées et suivi personnalisé.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg group"
                >
                  <Link href="/register">
                    Je veux tester gratuitement
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-slate-300 bg-transparent">
                  Voir la démo
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                  <span>+500 étudiants</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span>4.9/5</span>
                </div>
              </div>
            </div>

            {/* Mockup Dashboard */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-slate-300 text-sm">MémoireAI Dashboard</div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Mon Mémoire - Marketing Digital</h3>
                    <Badge className="bg-green-100 text-green-700">Analysé</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">Introduction structurée ✓</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">Problématique clarifiée ✓</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">Plan à améliorer</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">IA</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700">
                          &quot;Votre introduction est bien structurée ! Je suggère d&apos;ajouter une transition vers votre
                          première partie...&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800">Pourquoi choisir MémoireAI ?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Une approche révolutionnaire pour t&apos;accompagner dans la rédaction de ton mémoire
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Analyse intelligente de ton plan</h3>
                <p className="text-slate-600">
                  Notre IA examine la structure de ton mémoire et identifie les points à améliorer pour une cohérence
                  parfaite.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto">
                  <PenTool className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Questions guidées pour structurer</h3>
                <p className="text-slate-600">
                  Des questions personnalisées t&apos;aident à développer tes idées et à construire un raisonnement solide.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto">
                  <FolderOpen className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Historique et suivi complet</h3>
                <p className="text-slate-600">
                  Garde une trace de tous tes documents et de leur évolution pour un suivi optimal de ton travail.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800">Ce que disent nos étudiants</h2>
            <p className="text-xl text-slate-600">Plus de 500 étudiants nous font confiance</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 italic">&quot;{testimonial.content}&quot;</p>
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-slate-800">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800">Questions fréquentes</h2>
            <p className="text-xl text-slate-600">Tout ce que tu dois savoir sur MémoireAI</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border border-slate-200">
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-semibold text-slate-800">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-slate-600">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">Prêt à révolutionner ta façon d&apos;écrire ?</h2>
          <p className="text-xl text-blue-100">
            Rejoins des centaines d&apos;étudiants qui ont déjà transformé leur approche du mémoire
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
            <Link href="/register">
              Commencer gratuitement
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <PenTool className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MémoireAI</span>
              </div>
              <p className="text-slate-400">
                L&apos;IA qui révolutionne la rédaction de mémoires pour les étudiants africains.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <div className="space-y-2 text-slate-400">
                <div>Fonctionnalités</div>
                <div>Tarifs</div>
                <div>Démo</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-slate-400">
                <div>Centre d&apos;aide</div>
                <div>Contact</div>
                <div>FAQ</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <div className="space-y-2 text-slate-400">
                <div>Mentions légales</div>
                <div>Confidentialité</div>
                <div>CGU</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 MémoireAI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
