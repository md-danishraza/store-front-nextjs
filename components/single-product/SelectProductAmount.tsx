
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";


  // this select comp will be used at two place - product page and cart 
  export enum Mode {
    SingleProduct = "singleProduct",
    CartItem = "cartItem",
  }
//   prop type if used in product page
type SelectProductAmountProps = {
    mode: Mode.SingleProduct;
    amount: number;
    setAmount: (value: number) => void;
};

//   prop type if used in cart page
  type SelectCartItemAmountProps = {
    mode: Mode.CartItem;
    amount: number;
    setAmount: (value: number) => Promise<void>;
    isLoading: boolean;
  };
// amount in cart mgt refers to quanity of items
// controlled comp as setAmount fn will be used by parent
  function SelectProductAmount(
    props: SelectProductAmountProps | SelectCartItemAmountProps
  ) {
    const { mode, amount, setAmount } = props;
    // boolean to check whether used in cart
    const cartItem = mode === Mode.CartItem;
  
    return (
      <>
        <h4 className="mb-2">Amount : </h4>
        <Select
          defaultValue={amount.toString()}
          onValueChange={(value) => setAmount(Number(value))}
          disabled={cartItem ? props.isLoading : false}
        >
          <SelectTrigger className={cartItem ? "w-[100px]" : "w-[150px]"}>
            <SelectValue placeholder={amount} />
          </SelectTrigger>
          {/* in product page - quantity limit is 10
             but in cart page its +10
                */}
          <SelectContent>
            {Array.from({ length: cartItem ? amount + 10 : 10 }, (_, index) => {
              const selectValue = (index + 1).toString();
              return (
                <SelectItem key={index} value={selectValue}>
                  {selectValue}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </>
    );
  }
  export default SelectProductAmount;