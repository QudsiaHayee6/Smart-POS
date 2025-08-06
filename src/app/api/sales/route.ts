// /app/api/sales/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sales = await prisma.orders.findMany({
      where: {
        NOT: {
          status: "Cancelled", // 👈 exclude only cancelled
        },
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        created_at: true,
        payment_method: true,
        total: true,
        status: true, // 👈 include status
        items: true,
      },
    });

    return NextResponse.json(sales);
  } catch (err) {
    console.error("Sales API error:", err);
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  }
}
