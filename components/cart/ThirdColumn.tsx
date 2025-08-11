"use client";
import { useState } from "react";
import SelectProductAmount from "../single-product/SelectProductAmount";
import { Mode } from "../single-product/SelectProductAmount";
import FormContainer from "../form/FormContainer";
import { SubmitButton } from "../form/Buttons";
import { removeCartItemAction, updateCartItemAction } from "@/utils/actions";
import { toast } from "sonner";

function ThirdColumn({id,quantity}:{id:string,quantity:number}) {
  const [amount, setAmount] = useState(quantity);
  const [isLoading, setIsLoading] = useState(false);
  const timestamp = new Date().toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // toast("amount changed", {
  //   description: timestamp,
  // }); 
  const handleAmountChange = async (value: number) => {
    setIsLoading(true);
    toast("Calculating...");
    // update cart item with current amount
    const result = await updateCartItemAction({
      amount: value,
      cartItemId: id,
    });
    setAmount(value);
    toast(result.message,{description:timestamp});
    setIsLoading(false);
  };

  return (
    <div className="md:ml-8">
      <SelectProductAmount
        amount={amount}
        setAmount={handleAmountChange}
        mode={Mode.CartItem}
        isLoading={isLoading }
      />
      <FormContainer action={removeCartItemAction}>
        <input type="hidden" name="id" value={id} />
        <SubmitButton size="sm" className="mt-4" text="remove" />
      </FormContainer>
    </div>
  );
}

export default ThirdColumn
