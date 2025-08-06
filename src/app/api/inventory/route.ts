// File: app/api/inventory/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { dateFrom, dateTo } = await req.json();

    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const products = await prisma.products.findMany();

    const purchases = await prisma.purchases.findMany({
      where: {
        ...(fromDate && { created_at: { gte: fromDate } }),
        ...(toDate && { created_at: { lte: toDate } }),
      },
    });

    const transfers = await prisma.transfers.findMany({
      where: {
        ...(fromDate && { created_at: { gte: fromDate } }),
        ...(toDate && { created_at: { lte: toDate } }),
      },
    });

    const orders = await prisma.orders.findMany({
      where: {
        ...(fromDate && { created_at: { gte: fromDate } }),
        ...(toDate && { created_at: { lte: toDate } }),
      },
    });

    const inventory = products.map((product) => {
      const sku = product.sku;
      const opening = product.opening_stock || 0;

      const purchaseQty = purchases
        .filter((p) => p.sku === sku)
        .reduce((sum, p) => sum + p.quantity, 0);

      const transferIn = transfers
        .filter((t) => t.sku === sku && t.type === "In")
        .reduce((sum, t) => sum + t.quantity, 0);

      const transferOut = transfers
        .filter((t) => t.sku === sku && t.type === "Out")
        .reduce((sum, t) => sum + t.quantity, 0);

      const salesQty = orders
        .flatMap((o) => (o.items as any[] || []))
        .filter((item) => item.sku === sku)
        .reduce((sum, item) => sum + (item.quantity || 1), 0);

      return {
        product: product.name,
        sku,
        opening,
        purchase: purchaseQty,
        sales: salesQty,
        transferIn,
        transferOut,
        closing: opening + purchaseQty + transferIn - salesQty - transferOut,
      };
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("API error in /api/inventory:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
