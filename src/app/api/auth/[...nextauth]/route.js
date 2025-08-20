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
        // Validación temporal básica
        if (credentials.email === 'admin@consultorio.com' && credentials.password === 'admin123') {
          let user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })
          
          // Crear usuario si no existe
          if (!user) {
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: 'Administrador',
                role: 'ADMIN'
              }
            })
          }
          
          return { id: user.id, email: user.email, name: user.name }
        }
        return null
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login'
  }
})

export { handler as GET, handler as POST }
