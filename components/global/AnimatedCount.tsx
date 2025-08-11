"use client";
import CountUp from "react-countup";
import { formatCurrency } from "@/utils/format";

interface AnimatedCountUpProps {
  amount: number;
  format?:boolean
}

export default function AnimatedCountUp({ amount,format=false }: AnimatedCountUpProps) {
  return (
    <CountUp
      start={0}
      end={amount}
      duration={1}
      formattingFn={format ? formatCurrency : undefined}
    />
  );
}