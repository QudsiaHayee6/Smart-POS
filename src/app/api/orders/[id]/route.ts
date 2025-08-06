// /app/api/orders/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;

  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  try {
    // Step 1: Delete related order_items
    await prisma.order_items.deleteMany({
      where: { order_id: orderId },
    });

    // Step 2: Delete the order
    await prisma.orders.delete({
      where: { id: orderId },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Error deleting order:", err.message || err);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
