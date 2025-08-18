"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Define types for the Razorpay response and options
interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill: {
    email: string;
  };
  theme: {
    color: string;
  };
}

// Extend Window to declare the Razorpay class
declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): { open: () => void };
    };
  }
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const cartId = searchParams.get("cartId");

  useEffect(() => {
    if (!orderId) return;

    (async () => {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();

      const options: RazorpayOptions = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Store Front",
        description: "Order Payment",
        order_id: data.id,
        handler: async function (response: RazorpayPaymentResponse) {
          await fetch("/api/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
              cartId,
            }),
          });
          window.location.href = "/success";
        },
        prefill: {
          email: "customer@example.com",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    })();
  }, [orderId, cartId]);

  return <div>Loading Payment...</div>;
}