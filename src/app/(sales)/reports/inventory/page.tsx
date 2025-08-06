"use client";

import { useEffect, useState } from "react";
import * as FileSaver from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InventoryRow {
  product: string;
  sku: string;
  opening: number;
  purchase: number;
  sales: number;
  transferIn: number;
  transferOut: number;
  closing: number;
}

export default function InventoryReportPage() {
  const [inventoryData, setInventoryData] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchInventoryData();
  }, [dateFrom, dateTo]);

  const fetchInventoryData = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateFrom, dateTo }),
      });

      if (!res.ok) throw new Error("Failed to fetch inventory");

      const data = await res.json();
      setInventoryData(data);
    } catch (error: any) {
      setErrorMsg("Inventory data couldn't be loaded. Try again.");
      console.error("Inventory fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Product", "SKU", "Opening", "Purchase", "Sales", "Transfer In", "Transfer Out", "Closing"]],
      body: inventoryData.map(row => [
        row.product, row.sku, row.opening, row.purchase, row.sales, row.transferIn, row.transferOut, row.closing
      ]),
    });
    doc.save("Inventory_Report.pdf");
  };

  const exportToCSV = () => {
    const csvRows = ["Product,SKU,Opening,Purchase,Sales,TransferIn,TransferOut,Closing"];
    inventoryData.forEach(row => {
      csvRows.push(`${row.product},${row.sku},${row.opening},${row.purchase},${row.sales},${row.transferIn},${row.transferOut},${row.closing}`);
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8" });
    FileSaver.saveAs(blob, "Inventory_Report.csv");
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdf4] rounded-2xl shadow-xl">
      <h1 className="text-3xl font-extrabold mb-6 text-indigo-800 drop-shadow">
        Inventory Movement Report
      </h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div>
          <label className="text-sm font-semibold text-indigo-700">From:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border p-2 rounded ml-2"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-indigo-700">To:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border p-2 rounded ml-2"
          />
        </div>
        <button
          onClick={exportToPDF}
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-800"
        >
          Export PDF
        </button>
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-800"
        >
          Export CSV
        </button>
        <button
  onClick={fetchInventoryData}
  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
>
  Refresh Inventory
</button>
      </div>

      {errorMsg && (
        <div className="text-red-600 font-semibold mb-4">
          {errorMsg}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
            <tr>
              <th className="px-4 py-3 text-indigo-800 font-bold">Product</th>
              <th className="px-4 py-3 text-indigo-800 font-bold">SKU</th>
              <th className="px-4 py-3 text-indigo-800 font-bold">Opening</th>
              <th className="px-4 py-3 text-indigo-800 font-bold">Purchase</th>
              <th className="px-4 py-3 text-indigo-800 font-bold">Sales</th>
              <th className="px-4 py-3 text-indigo-800 font-bold">Transfer In</th>
              <th className="px-4 py-3 text-indigo-800 font-bold">Transfer Out</th>
              <th className="px-4 py-3 text-indigo-800 font-bold">Closing</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-lg text-indigo-600 bg-indigo-50 font-semibold rounded-b-xl">
                  Loading...
                </td>
              </tr>
            ) : inventoryData.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-lg text-green-700 bg-green-50 font-semibold rounded-b-xl">
                  No inventory data found.
                </td>
              </tr>
            ) : (
              inventoryData.map((row, i) => (
                <tr key={i} className="even:bg-indigo-50 hover:bg-purple-50 transition">
                  <td className="px-4 py-2 text-indigo-900">{row.product}</td>
                  <td className="px-4 py-2 text-indigo-900">{row.sku}</td>
                  <td className="px-4 py-2 text-indigo-900">{row.opening}</td>
                  <td className="px-4 py-2 text-green-700 font-bold">{row.purchase}</td>
                  <td className="px-4 py-2 text-indigo-900">{row.sales}</td>
                  <td className="px-4 py-2 text-indigo-900">{row.transferIn}</td>
                  <td className="px-4 py-2 text-indigo-900">{row.transferOut}</td>
                  <td className="px-4 py-2 text-indigo-900 font-bold">{row.closing}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
