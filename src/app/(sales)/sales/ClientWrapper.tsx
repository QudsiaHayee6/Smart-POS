// app/(sales)/sales/ClientWrapper.tsx
"use client";

import { useState } from "react";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import BarcodeScanner from "@/components/BarcodeScanner";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/cartStore";

type Product = {
  id: string;
  name: string;
  price: number;
  sku: string;
  createdAt: string;
  image_url: string;
};

interface Props {
  products: Product[];
}

export default function ClientWrapper({ products }: Props) {
  const [search, setSearch] = useState("");
  const { addToCart } = useCartStore();

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-white via-[#f3e8ff] to-[#dcd0ff] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-md border-2 border-purple-200 shadow-md focus:border-purple-400 transition"
          />
          <BarcodeScanner
            products={products.map((p) => ({ ...p, image: p.image_url }))}
            onScan={(product) => addToCart(product)}
          />
          <CartDrawer />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length ? (
            filtered.map((p) => (
              <ProductCard key={p.id} product={{ ...p, image: p.image_url }} />
            ))
          ) : (
            <p className="col-span-full text-center text-purple-700 bg-purple-100 rounded-lg py-8 font-semibold shadow">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
