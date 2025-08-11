import React from 'react'
import Link from 'next/link';
import { Button } from '../ui/button';
// import { LuArmchair } from 'react-icons/lu';
import { VscCode } from 'react-icons/vsc';

function Logo() {
  return (
    <Button size='icon' asChild className='order-1'>
      <Link href='/'>
        <VscCode className='w-8 h-8'/>
      </Link>
    </Button>
  )
}

export default Logo
