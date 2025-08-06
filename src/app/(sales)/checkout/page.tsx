"use client";

import { useCartStore } from "@/lib/cartStore";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, removeFromCart, clearCart } = useCartStore();
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handlePlaceOrder = async () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[0-9]{11}$/;

    if (!name || !phone || !address) {
      setError("⚠️ Please fill in all your information to place the order.");
      return;
    }
    if (!nameRegex.test(name)) {
      setError("⚠️ Name should only contain letters and spaces.");
      return;
    }
    if (!phoneRegex.test(phone)) {
      setError("⚠️ Phone number must be exactly 11 digits.");
      return;
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      setError("⚠️ Cart is empty. Add items to checkout.");
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          address,
          paymentMethod,
          cart,
          total,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Unknown error");
      }

      setError("");
      setConfirmedTotal(total);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error("❌ Checkout error:", err);
      setError("❌ Failed to place order. Please try again.");
    }
  };

  if (orderPlaced) {
    return (
      <div className="p-6 text-center max-w-md mx-auto bg-gradient-to-br from-green-50 via-indigo-50 to-white rounded-2xl shadow-lg mt-10">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Order Confirmed!
        </h1>
        <p className="text-lg mb-2">
          Thank you,{" "}
          <span className="text-indigo-700 font-semibold">{name}</span>!
        </p>
        <p className="text-gray-600">
          Your order has been placed successfully.
        </p>
        <p className="mt-4">
          We will contact you at <strong>{phone}</strong> and deliver to:
        </p>
        <p className="italic text-sm text-gray-500 mt-2">{address}</p>
        <div className="mt-6 text-xl font-semibold text-indigo-700">
          Total: Rs {confirmedTotal}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdf4] rounded-2xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-indigo-800">Checkout</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-200 font-medium">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-2 border-indigo-100 focus:border-green-300 p-2 rounded shadow-sm transition"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border-2 border-indigo-100 focus:border-green-300 p-2 rounded shadow-sm transition"
        />
        <textarea
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border-2 border-indigo-100 focus:border-green-300 p-2 rounded shadow-sm transition"
          rows={3}
        />
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border-2 border-indigo-100 focus:border-green-300 p-2 rounded shadow-sm transition"
        >
          <option>Cash on Delivery</option>
          <option>JazzCash</option>
          <option>EasyPaisa</option>
        </select>
      </div>

      {cart.length === 0 ? (
        <p className="text-green-700 bg-green-50 rounded-lg py-4 text-center font-semibold shadow">
          Your cart is empty.
        </p>
      ) : (
        <div className="space-y-4 mb-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border border-indigo-100 p-3 rounded-xl bg-gradient-to-br from-white via-indigo-50 to-green-50 shadow-sm"
            >
              <div>
                <h2 className="font-semibold text-indigo-900">{item.name}</h2>
                <p className="text-green-700 font-medium">
                  Rs {item.price} × {item.quantity || 1}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:underline font-semibold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="text-right font-semibold text-lg mb-4 text-indigo-900">
        Total: Rs {total}
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-indigo-900 transition"
      >
        Place Order
      </button>
    </div>
  );
}
