"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cartStore";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
  } = useCartStore();

  const router = useRouter();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    router.push("/checkout"); // Redirect to checkout page
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-indigo-700 text-white font-semibold border-none shadow hover:bg-indigo-900 transition" variant="outline">
          🛒 Cart ({cart.length})
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdf4] border-l border-indigo-100 shadow-xl rounded-l-2xl">
        <SheetTitle className="text-lg font-bold mb-4 text-indigo-700">Cart</SheetTitle>

        <div className="space-y-4">
          {cart.length === 0 && <p className="text-green-700 bg-green-50 rounded-lg py-4 text-center font-semibold shadow">No items in cart.</p>}
          {cart.map((item) => (
            <div key={item.id} className="border border-indigo-100 rounded-xl p-3 space-y-1 bg-gradient-to-br from-white via-indigo-50 to-green-50 shadow-sm">
              <p className="text-sm font-medium text-indigo-900">{item.name}</p>
              <p className="text-xs text-green-700">
                Rs. {item.price} × {item.quantity}
              </p>
              <div className="flex gap-2 mt-1">
                <Button size="sm" className="bg-indigo-100 text-indigo-700 hover:bg-green-200 hover:text-green-800 transition" onClick={() => decreaseQty(item.id)}>−</Button>
                <Button size="sm" className="bg-indigo-100 text-indigo-700 hover:bg-green-200 hover:text-green-800 transition" onClick={() => increaseQty(item.id)}>+</Button>
                <Button
                size="sm"
                onClick={() => removeFromCart(item.id)}
                className="bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-900 transition font-semibold rounded"
              >
               Remove
              </Button>

              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="font-semibold text-indigo-900">Total: Rs. {total}</p>
            <Button className="w-full bg-indigo-700 text-white font-semibold border-none shadow hover:bg-indigo-900 transition" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
            <Button variant="outline" className="w-full border-indigo-200 text-green-700 hover:bg-green-50 hover:text-green-900 transition" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
