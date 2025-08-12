import crypto from "crypto";
import { NextResponse } from "next/server";
import db from "@/utils/db";

export async function POST(req: Request) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
    cartId,
  } = await req.json();

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature !== expectedSign) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Update DB
  await db.order.update({
    where: { id: orderId },
    data: { isPaid: true },
  });

  await db.cart.delete({ where: { id: cartId } });

  return NextResponse.json({ success: true });
}
