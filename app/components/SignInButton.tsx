'use client';

import { signOut, signIn, useSession } from 'next-auth/react'
import React from 'react'


const SignInButton = () => {
    const { data: session } = useSession();

    if (session && session.user) {
        return (
            <div className='flex gap-4 items-center '><img className='w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'
                    src={session.user.image as string}
                    alt="Picture of the author"
                />
                <div className='flex flex-col'>
                <p className='text-xs'>Hello,</p>
                <p className='text-sm'>{session.user.name}</p>
                </div>
                
                {/* <p>{session.user.image}</p> */}
                {/* <p>{session.user.email}</p> */}
                <button className='btn btn-sm btn-secondary' onClick={() => signOut()}>↪</button>
            </div>
        )

    }


    return (
        <button className='btn btn-sm btn-secondary' onClick={() => signIn()}>Sign In</button>

    )
}

export default SignInButton