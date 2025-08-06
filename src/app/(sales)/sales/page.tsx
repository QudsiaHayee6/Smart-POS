// app/(sales)/sales/page.tsx
import { prisma } from "@/lib/prisma";
import { products as ProductModel } from "@prisma/client";
import ClientWrapper from "./ClientWrapper";

export const dynamic = "force-dynamic"; // prevent caching issues

export default async function SalesPage() {
  const products: ProductModel[] = await prisma.products.findMany({
    orderBy: { created_at: "desc" },
  });

  const formatted = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price), // Decimal to number
    sku: p.sku,
    createdAt: p.created_at?.toISOString() ?? "",
    image_url: p.image_url?.trim() !== "" ? p.image_url : "/images/default.jpg",
  }));

  return <ClientWrapper products={formatted} />;
}
