import Link from 'next/link'
import React from 'react'
import SignInButton from './components/SignInButton'
// import { Settings } from './components/Settings';

const NavBar = () => {
  return (
    <nav className='flex space-x-6 border-b p-5 h-14 items-center justify-between'>
        {/* <Settings /> */}
        {/* <ul className='flex space-x-6 p-2 items-center'>
            <li><Link href='/'>Calorie Form</Link></li>
            <li><Link href='/'>New Calorie Form</Link></li>
            
        </ul> */}
        <SignInButton />
        <Link href={'/DBCalories'} ><button className='btn btn-secondary'>Database Version</button></Link>
    </nav>
  )
}

export default NavBar