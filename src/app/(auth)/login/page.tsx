"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Dummy users (You can add "name" too if needed)
const users = [
  { name: "Admin", email: "admin@example.com", password: "123", role: "admin" },
  { name: "Cashier", email: "cashier@example.com", password: "123", role: "cashier" },
  { name: "Inventory", email: "inventory@example.com", password: "123", role: "inventory_manager" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Save role in localStorage
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name); // optional
      router.push("/sales"); // You can change route if needed
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdf4]">
      <form
        onSubmit={handleLogin}
        className="bg-white/90 p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-5 border border-indigo-100"
      >
        <h1 className="text-3xl font-extrabold text-indigo-700 text-center mb-2 drop-shadow">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border-2 border-indigo-100 focus:border-green-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border-2 border-indigo-100 focus:border-green-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm text-center font-semibold bg-red-50 rounded py-2 shadow">{error}</p>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-green-400 text-white py-2.5 rounded-lg shadow-md font-bold text-lg hover:opacity-90 transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
}
