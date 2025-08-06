"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("userRole");
    document.cookie = "role=; Max-Age=0; path=/";
    // Small delay to show "Logging out..." screen
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdf4] text-indigo-900">
      <div className="text-center space-y-4 bg-white/80 rounded-2xl shadow-xl px-10 py-8 border border-indigo-100">
        <svg
          className="animate-spin h-10 w-10 mx-auto text-indigo-700 drop-shadow"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p className="text-2xl font-extrabold text-indigo-800">Logging out...</p>
        <p className="text-sm text-green-700">You are being securely signed out. Redirecting to login...</p>
      </div>
    </div>
  );
}
