'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

function SignInbtn({ className, uppercase }: { className: string, uppercase?: string}) {
    const {data: session, status} = useSession()
  return (
      <li className={`${className}`} >
    {session ? (
          <button onClick={()=> signOut()} className={uppercase}>
          Sign Out
          </button>
      ) : (
          <button onClick={()=> signIn("google")} className={uppercase}>
          Sign In
          </button>
      )}
      </li>
  )
}

export default SignInbtn