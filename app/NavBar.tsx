import SignInButton from './components/SignInButton'
// import { Settings } from './components/Settings';

const NavBar = () => {
  return (
    <nav className='flex space-x-6 border-b p-5 h-14 items-center justify-between'>
        <SignInButton />
    </nav>
  )
}

export default NavBar