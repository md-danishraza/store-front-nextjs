import React from 'react'
import { Card, CardContent, CardHeader,CardFooter } from "@/components/ui/card";
import Rating from './Rating';
import Comment from './Comment';
import Image from 'next/image';
function ReviewCard({reviewInfo,children}:{reviewInfo:{comment:string,rating:number,image:string,name:string},children?:React.ReactNode}) {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center">
          <Image
            src={reviewInfo.image}
            alt={reviewInfo.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-4">
            <h3 className="text-sm font-bold capitalize mb-1">
              {reviewInfo.name}
            </h3>
            <Rating rating={reviewInfo.rating} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Comment comment={reviewInfo.comment} />
      </CardContent>
      <CardFooter className="absolute top-3 right-3">{children}</CardFooter>
    </Card>
  )
}

export default ReviewCard
