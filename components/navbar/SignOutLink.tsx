'use client'
import React from 'react'
import { SignOutButton } from '@clerk/nextjs'
import { toast } from 'sonner'
import Link from 'next/link'
function SignOutLink() {
  const handleLogout = ()=>{
    toast("Logout Successfully!")
  }
  return (
  <SignOutButton >
    <Link className='w-full text-left' href='/' onClick={handleLogout}>
    Log Out
    </Link>
  </SignOutButton>
  )
}

export default SignOutLink
