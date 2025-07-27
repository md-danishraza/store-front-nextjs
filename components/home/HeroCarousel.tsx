import React from 'react'
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import hero1 from '@/public/images/hero1.jpg';
import hero2 from '@/public/images/hero2.jpg';
import hero3 from '@/public/images/hero3.jpg';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

function HeroCarousel() {
  return (
    <div className='px-8 order-1 lg:order-2'>
      <Carousel className=" shadow-lg dark:shadow-white dark:shadow-sm">
      <CarouselContent>
      
          <CarouselItem>
            <div className="">
              <Card>
                <CardContent className="p-2">
                  <Image src={hero1}  className='w-full h-[24rem] rounded-md  object-cover '  alt='hero images'/>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="">
              <Card>
                <CardContent className="p-2">
                  <Image src={hero2}  className='w-full h-[24rem] rounded-md  object-cover '  alt='hero images'/>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="">
              <Card>
                <CardContent className="p-2">
                  <Image src={hero3}  className='w-full h-[24rem] rounded-md  object-cover '  alt='hero images'/>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
       
      </CarouselContent>
      <CarouselPrevious className='dark:shadow-white dark:shadow-sm'/>
      <CarouselNext className='dark:shadow-white dark:shadow-sm'/>
    </Carousel>
    </div>
  )
}

export default HeroCarousel
