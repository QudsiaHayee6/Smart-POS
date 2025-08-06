// app/api/orders/status/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { orderId, newStatus } = body;

  if (!orderId || !newStatus) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const updated = await prisma.orders.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    console.error("Status update failed:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
