"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

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

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Store Front",
        description: "Order Payment",
        order_id: data.id,
        handler: async function (response: any) {
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

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    })();
  }, [orderId, cartId]);

  return <div>Loading Payment...</div>;
}
