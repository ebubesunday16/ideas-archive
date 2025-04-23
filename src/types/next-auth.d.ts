// In types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      email: string
      name?: string
      image?: string
      savedIdeas: string[]
    }
  }
}