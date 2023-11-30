import Link from 'next/link'
import React from 'react'
import { AiFillBug } from 'react-icons/ai'

const NavBar = () => {
  return (
    <nav className='flex space-x-6 border-b px-5 h-14 items-center'>
        <Link href='/'><AiFillBug></AiFillBug></Link>
        <ul className='flex space-x-6 p-2'>
            <li><Link href='/'>Fake Link</Link></li>
            <li><Link href='/'>Fake Link</Link></li>
        </ul>
    </nav>
  )
}

export default NavBar