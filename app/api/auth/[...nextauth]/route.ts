import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
// import { prisma } from "@/lib/prisma" // Removed
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        // Import dynamique pour éviter les dépendances circulaires possibles côté serveur si besoin, 
        // mais ici c'est bon car c'est une route API
        const { getUserByEmail } = await import('@/lib/firestore-utils');

        const user = await getUserByEmail(credentials.email)
        if (!user) return null
        const isValid = await bcrypt.compare(credentials.password, user.password_hash)
        if (!isValid) return null
        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session?.user && token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
