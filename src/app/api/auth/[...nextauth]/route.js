import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
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
          
          // Validación simple para el usuario administrador
          if (credentials.email === 'admin@consultorio.com' && credentials.password === 'admin123') {
            console.log('✅ Credenciales válidas')
            return {
              id: '1',
              email: 'admin@consultorio.com',
              name: 'Dr. Administrador',
              role: 'DOCTOR'
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
  secret: process.env.NEXTAUTH_SECRET,
  debug: false // Desactivar debug para reducir logs
})

export { handler as GET, handler as POST }
