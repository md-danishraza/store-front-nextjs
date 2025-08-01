"use client";
import React from 'react'
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import FormContainer from "./FormContainer";
import ImageInput from "./ImageInput";
import { SubmitButton } from "./Buttons";
import { type actionFunction } from "@/utils/types";

type ImageInputContainerProps = {
  image: string;
  name: string;
  action: actionFunction;
  text: string;
  children?: React.ReactNode;
};


// this will be used in update product page
//  productId and image url will be hidden input children
function ImageInputContainer(props: ImageInputContainerProps) {
    const { image, name, action, text } = props;
    const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
  
    return (
      <div className="mb-8">
        <Image
          src={image}
          width={200}
          height={200}
          className="rounded-md object-cover mb-4 w-[200px] h-[200px]"
          alt={name}
        />
  
        <Button
          variant="outline"
          size="sm"
          onClick={() => setUpdateFormVisible((prev) => !prev)}
        >
          {text}
        </Button>
        {isUpdateFormVisible && (
          <div className="max-w-md mt-4">
            <FormContainer action={action}>
              {props.children}
              <ImageInput />
              <SubmitButton size="sm" />
            </FormContainer>
          </div>
        )}
      </div>
    );
}

export default ImageInputContainer
