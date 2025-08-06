// /app/api/checkout/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, phone, address, paymentMethod, cart, total } = body;

  try {
    const order = await prisma.orders.create({
      data: {
        customer: name,
        phone,
        address,
        total,
        items: cart,
        payment_method: paymentMethod === "Cash on Delivery" ? "Cash" : paymentMethod,
        status: "Pending",
      },
    });

    await prisma.order_items.createMany({
      data: cart.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity || 1,
        price: item.price,
      })),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
