'use client';

import { signIn } from "next-auth/react"


export const SignInButtonClient = () => {
  return (
    <button className='btn btn-sm btn-neutral' onClick={() => signIn()}>Sign In</button>
  )
}
