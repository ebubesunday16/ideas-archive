'use client'
// components/UserCreationHandler.tsx
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabaseClient'

export default function UserCreationHandler() {
  const { data: session, status } = useSession()

  useEffect(() => {
    async function createUserIfNeeded() {
      if (status !== 'authenticated' || !session?.user) return

      try {
        // Check if user already exists in Supabase
        const { data: existingUser, error: queryError } = await supabase
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single()

        if (queryError && queryError.code !== 'PGRST116') {
          console.error("Error checking for existing user:", queryError)
          return
        }

        // If user doesn't exist, create them
        if (!existingUser) {
          const userId = session.user.id || crypto.randomUUID()
          
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: userId,
              email: session.user.email,
              name: session.user.name || '',
              saved_idea_ids: []
            })

          if (insertError) {
            console.error("Error creating user in Supabase:", insertError)
          }
        }
      } catch (error) {
        console.error("Unexpected error in createUserIfNeeded:", error)
      }
    }

    createUserIfNeeded()
  }, [session, status])

  return null // This component doesn't render anything
}