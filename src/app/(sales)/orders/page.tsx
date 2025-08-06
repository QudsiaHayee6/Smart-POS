"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  customer: string;
  phone?: string;
  address?: string;
  total: number;
  items?: { name: string; price: number; quantity: number }[];
  status: string;
  payment_method?: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-200 text-green-800";
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "Cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedOrder) return;

    try {
      const res = await fetch("/api/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          newStatus: status,
        }),
      });

      if (!res.ok) throw new Error("Status update failed");
      const { order: updatedOrder } = await res.json();

      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );

      setSelectedOrder((prev) => prev && { ...prev, status });
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedOrder) return;
    const confirmDelete = confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete order");

      // Remove from local state
      setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
      setSelectedOrder(null);
    } catch (err) {
      console.error("Delete order error:", err);
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdf4] min-h-screen">
      <h1 className="text-2xl font-bold text-indigo-900 mb-6">Orders</h1>

      <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-indigo-50 text-indigo-800 text-sm">
              <th className="p-3 text-left border-b">Order ID</th>
              <th className="p-3 text-left border-b">Customer</th>
              <th className="p-3 text-left border-b">Total (PKR)</th>
              <th className="p-3 text-left border-b">Status</th>
              <th className="p-3 text-left border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 text-sm">
                <td className="p-3 border-b">{order.id}</td>
                <td className="p-3 border-b">{order.customer}</td>
                <td className="p-3 border-b">Rs. {order.total}</td>
                <td className="p-3 border-b">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3 border-b">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-indigo-600 hover:underline text-xs font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-indigo-800 mb-4">
              Order Details
            </h2>
            <p>
              <strong>Customer:</strong> {selectedOrder.customer}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.phone || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address || "N/A"}
            </p>
            <p>
              <strong>Total:</strong> Rs {selectedOrder.total}
            </p>
            <p>
              <strong>Payment Method:</strong>{" "}
              {selectedOrder.payment_method || "Not specified"}
            </p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status:
              </label>
              <div className="flex gap-2 flex-wrap">
                {["Pending", "Completed", "Cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      selectedOrder.status === status
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {Array.isArray(selectedOrder.items) &&
              selectedOrder.items.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Items:</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                    {selectedOrder.items.map((item, i) => (
                      <li key={i}>
                        {item.name} × {item.quantity || 1} — Rs {item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Delete Order
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
