"use client";
import { useState } from "react";
import { SubmitButton } from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";
import { Card } from "@/components/ui/card";
import RatingInput from "@/components/reviews/RatingInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import { Button } from "@/components/ui/button";
import { createReviewAction } from "@/utils/actions";
import { useUser } from "@clerk/nextjs";

function SubmitReview({productId}:{productId:string}) {
    const [isReviewFormVisible,setReviewFormVisible] = useState(false);
    // only for getting name and profile image if exist on clerk
    const {user} = useUser();


  return (
    <div>
        {/* btn to toggle review */}
      <Button size='lg' className="capitalize" onClick={()=>setReviewFormVisible((prev)=>!prev)}>
        Leave review
      </Button>
      {
        isReviewFormVisible &&
        <Card className="p-8 mt-8">
            {/* will pass data as hidden inputs */}
            <FormContainer action={createReviewAction}>
            <input type="hidden" name="productId" value={productId} />
            <input
              type="hidden"
              name="authorName"
              value={user?.firstName || "user"}
            />
            <input
              type="hidden"
              name="authorImageUrl"
              value={user?.imageUrl || ""}
            />
            <RatingInput name="rating" />
            <TextAreaInput
              name="comment"
              labelText="feedback"
              defaultValue="Outstanding product!!!"
            />
            <SubmitButton className="mt-4" text="submit review"/>
            </FormContainer>
        </Card>
      }
    </div>
  )
}

export default SubmitReview
