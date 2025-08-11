import React from 'react'
import Container from '../global/Container'
import Logo from './Logo'
import NavSearch from './NavSearch'
import CartButton from './CartButton'
import DarkMode from './DarkMode'
import LinksDropdown from './LinksDropdown'
import { Suspense } from 'react';
function Navbar() {
  return (
  <nav className='border-b'>
    <Container className='flex  sm:flex-row flex-wrap justify-between sm:items-center gap-4 py-8 transition-all '>
      <Logo />
      <Suspense>
      <NavSearch  className='order-3 md:order-2 transition-all'/>
      </Suspense>
      <div className='flex gap-4 items-center order-2 md:order-3'>
        <CartButton/>
        <DarkMode/>
        <LinksDropdown/>
      </div>
    </Container>

  </nav>
  )
}

export default Navbar
