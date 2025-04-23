'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

function SignInbtn({ className }: { className: string}) {
    const {data: session, status} = useSession()
  return (
      <li className={`${className}`} >
    {session ? (
          <button onClick={()=> signOut()}>
          Sign Out
          </button>
      ) : (
          <button onClick={()=> signIn("google")}>
          Sign In
          </button>
      )}
      </li>
  )
}

export default SignInbtn