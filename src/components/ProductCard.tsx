"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cartStore";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  sku: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [showPopup, setShowPopup] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1800);
  };

  return (
    <>
      {/* Popup notification at bottom right */}
      {showPopup && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-100 border border-green-300 text-green-800 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in-out">
          <svg
            className="w-6 h-6 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-semibold">{product.name} added to cart!</span>
        </div>
      )}
      {/* Image modal */}
      {showImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setShowImage(false)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-2xl border-4 border-white"
          />
        </div>
      )}
      <Card className="flex flex-col justify-between shadow-md border border-indigo-100 rounded-xl bg-white/90 hover:shadow-lg transition">
        <CardContent className="p-4 flex flex-col items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-32 object-contain mb-2 rounded-lg bg-gradient-to-br from-indigo-50 to-green-50 cursor-pointer hover:scale-105 transition"
            onClick={() => setShowImage(true)}
          />
          <h4 className="text-sm font-semibold text-indigo-900 mb-1">
            {product.name}
          </h4>
          <p className="text-sm text-green-700 font-medium">
            Rs. {product.price}
          </p>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={handleAdd}
            className="w-full text-sm bg-gradient-to-r from-green-200 to-indigo-100 text-indigo-900 font-semibold border-none shadow hover:from-green-300 hover:to-indigo-200 transition rounded-lg"
          >
          Add to Cart
          </Button>

        </CardFooter>
      </Card>
      {/* Fade-in-out animation */}
      <style jsx global>{`
        @keyframes fade-in-out {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.95);
          }
          10% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          90% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(16px) scale(0.95);
          }
        }
        .animate-fade-in-out {
          animation: fade-in-out 1.8s both;
        }
      `}</style>
    </>
  );
}
