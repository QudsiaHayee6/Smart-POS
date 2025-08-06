"use client";

import { useEffect, useState } from "react";

type Sale = {
  id: number;
  created_at: string;
  payment_method: string;
  total: number;
  status: string;
  items: any[];
};

export default function SalesReportPage() {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [payment, setPayment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sales");
      if (!res.ok) throw new Error("Failed to fetch sales");
      const data = await res.json();
      setSalesData(data || []);
    } catch (err) {
      console.error("Sales fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const filtered = salesData.filter((row) =>
    payment ? row.payment_method === payment : true
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdf4] rounded-2xl shadow-xl">
      <h1 className="text-3xl font-extrabold mb-6 text-indigo-800 drop-shadow">
        Sales Report
      </h1>

      <div className="mb-6">
        <select
          className="border px-3 py-2 rounded-lg shadow text-indigo-800"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        >
          <option value="">All Payments</option>
          <option value="Cash">Cash</option>
          <option value="JazzCash">JazzCash</option>
          <option value="EasyPaisa">EasyPaisa</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Payment</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Items</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-600">
                  No sales data found.
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="even:bg-indigo-50">
                  <td className="px-4 py-2">
                    {new Date(order.created_at).toISOString().split("T")[0]}
                  </td>
                  <td className="px-4 py-2">{order.payment_method}</td>
                  <td className="px-4 py-2 text-green-700 font-bold">
                    Rs. {order.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {Array.isArray(order.items) ? order.items.length : 0}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
