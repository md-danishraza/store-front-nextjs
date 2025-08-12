import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import db from "@/utils/db";

export async function POST(req: Request) {
  const { orderId } = await req.json();

  const order = await db.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const options = {
    amount: order.orderTotal * 100, // in paise
    currency: "INR",
    receipt: orderId,
    notes: {
      email: order.email,
      products: `${order.products} items`,
    },
  };

  const razorpayOrder = await razorpay.orders.create(options);

  return NextResponse.json({
    id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID,
    orderId: orderId,
  });
}
