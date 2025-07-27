import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import HeroCarousel from './HeroCarousel'

function Hero() {
  return (
    <section className='grid lg:grid-cols-2 gap-24 items-center'>
        {/* content */}
        <div className='order-2 lg:order-1'>
          <h1 className='max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl '>
            We are changing the way people shop
          </h1>
          <p className='mt-8 max-w-xl text-lg leading-8 texxt-muted-foreground'>
          Step into a world where style meets soul—welcome to your new favorite store. Whether you're chasing timeless elegance or daring trends, we’ve curated a collection that brings quality, comfort, and a touch of magic to every purchase.
          </p>
          <Button asChild size='lg' className='mt-10'>
            <Link href="/products">Out Products</Link>
          </Button>
        </div>
        {/* carousel */}
        <HeroCarousel />
    </section>
  )
}

export default Hero
