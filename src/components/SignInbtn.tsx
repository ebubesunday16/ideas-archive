'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

function SignInbtn({ className }: { className: string}) {
    const session = useSession()
  return (
      <li className={`${className}`} >
    {session ? (
          <button onClick={()=> signOut()}>
          SIGN OUT
          </button>
      ) : (
          <button onClick={()=> signIn("google")}>
          SIGN IN
          </button>
      )}
      </li>
  )
}

export default SignInbtn
