import { formatCurrency } from "@/utils/format";
import Image from "next/image";
import Link from "next/link";
// image column
export const FirstColumn = ({
  name,
  image,
}: {
  image: string;
  name: string;
}) => {
  return (
    <div className="relative h-24 w-24 sm:h-32 sm:w-32">
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw"
        priority
        className="w-full rounded-md object-cover"
      />
    </div>
  );
};
// product name and company and link to product
export const SecondColumn = ({
  name,
  company,
  productId,
}: {
  name: string;
  company: string;
  productId: string;
}) => {
  return (
    <div className=" sm:w-48">
      <Link href={`/products/${productId}`} className="text-primary hover:text-primary/80 transition-colors">
        <h3 className="capitalize font-medium hover:underline">{name}</h3>
      </Link>
      <h4 className="mt-2 capitalize text-xs">{company}</h4>
    </div>
  );
};

// price column
export const FourthColumn = ({ price }: { price: number }) => {
  return <p className="font-medium md:ml-auto">{formatCurrency(price)}</p>;
};