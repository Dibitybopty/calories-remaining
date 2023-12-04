import Link from 'next/link'
import React from 'react'
// import { Settings } from './components/Settings';

const NavBar = () => {
  return (
    <nav className='flex space-x-6 border-b px-5 h-14 items-center'>
        {/* <Settings /> */}
        <ul className='flex space-x-6 p-2'>
            <li><Link href='/'>Old Calorie Form</Link></li>
            <li><Link href='/'>New Calorie Form</Link></li>
        </ul>
    </nav>
  )
}

export default NavBar