import { authConfig } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'
import { SignOutButtonClient } from './SignOutButtonClient'
import { SignInButtonClient } from './SignInButtonClient'


const SignInButton = async () => {
    // const { data: session } = useSession();
    const session = await getServerSession(authConfig)

    if (session && session.user) {


        return (
            <div className='flex gap-4 items-center  '><img className='w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'
                    src={session.user.image as string}
                    alt="Picture of the author"
                />
                <div className='flex flex-col'>
                <p className='text-xs'>Hello,</p>
                <p className='text-sm'>{session.user.name}</p>
                </div>
                
                {/* <p>{session.user.image}</p> */}
                {/* <p>{session.user.email}</p> */}
                <SignOutButtonClient />
                {/* <button className='btn btn-sm btn-secondary' onClick={() => createUser(session.user?.name as string, session.user?.email as string, session.user?.image as string)}>↪</button> */}
            </div>
        )

    }


    return (
        <SignInButtonClient />

    )
}

export default SignInButton