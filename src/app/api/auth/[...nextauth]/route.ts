import GoogleProvider from "next-auth/providers/google"
import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next";
import { supabase } from "@/lib/supabaseClient";



export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async signIn({ user, account, profile, email, credentials }) {
          if (user) {
            try {
              const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', user.email)
                .single();
   
              if (!existingUser) {
                const userId = user.id || crypto.randomUUID();
               
                const { error } = await supabase
                  .from('users')
                  .insert({
                    id: userId,
                    email: user.email,
                    name: user.name,
                    saved_idea_ids: []
                  });
                 
                if (error) {
                  console.error("Error creating user in Supabase:", error);
                }
              }
            } catch (error) {
              console.error("Error in NextAuth signIn callback:", error);
            }
          }
         
          return true; // Allow sign in
        },
        
    },
   
    session: {
        strategy: "jwt", // Use JWT for storing session data
        maxAge: 30 * 24 * 60 * 60, // Session expires after 30 days
    },
    secret: process.env.NEXTAUTH_SECRET!,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }