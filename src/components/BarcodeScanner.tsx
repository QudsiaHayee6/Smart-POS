"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  sku: string;
}

interface Props {
  products: Product[];
  onScan: (product: Product) => void;
}

export default function BarcodeScanner({ products, onScan }: Props) {
  const [barcode, setBarcode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleScan = () => {
    const matched = products.find((p) => p.sku === barcode);
    if (matched) {
      onScan(matched);
      setBarcode("");
      setErrorMessage(""); // clear error if successful
    } else {
      setErrorMessage("❌ Product not found for this barcode.");
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 bg-white/80 rounded-xl shadow p-4 border border-indigo-100">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Scan barcode..."
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleScan();
          }}
          className="w-48 border-2 border-indigo-100 focus:border-green-300 transition shadow-sm"
        />
        <Button
          variant="outline"
          onClick={handleScan}
          className="bg-gradient-to-r from-green-200 to-indigo-100 text-indigo-900 font-semibold border-none shadow hover:from-green-300 hover:to-indigo-200 transition"
        >
          Scan
        </Button>
      </div>

      {/* Error message UI */}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1 animate-pulse bg-red-50 rounded px-2 py-1 border border-red-200">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
