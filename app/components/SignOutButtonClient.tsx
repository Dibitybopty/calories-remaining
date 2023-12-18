'use client';

import { signOut } from "next-auth/react";

export const SignOutButtonClient = () => {
  return (
    <button className='btn btn-sm btn-secondary' onClick={() => signOut()}>↪</button>
  )
}
