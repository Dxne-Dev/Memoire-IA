import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string // ou number selon votre modèle
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
