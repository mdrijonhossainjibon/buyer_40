import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
  }

  interface User {
    token?: string
  }

  interface JWT {
    accessToken?: string
  }
}
