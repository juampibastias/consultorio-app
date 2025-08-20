import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from '@/lib/prisma'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('🔍 Intentando autenticar:', credentials.email)
          
          // Buscar usuario en la base de datos
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })
          
          console.log('👤 Usuario encontrado:', user ? 'Sí' : 'No')
          
          if (user && credentials.email === 'admin@consultorio.com' && credentials.password === 'admin123') {
            console.log('✅ Credenciales válidas')
            return { 
              id: user.id, 
              email: user.email, 
              name: user.name,
              role: user.role
            }
          }
          
          console.log('❌ Credenciales inválidas')
          return null
          
        } catch (error) {
          console.error('❌ Error en autorización:', error)
          return null
        }
      }
    })
  ],
  session: { 
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === 'development'
})

export { handler as GET, handler as POST }
