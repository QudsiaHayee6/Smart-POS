"use client";

import Link from "next/link";
import { FileText, BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Reports</h1>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Sales Report Card */}
        <Link
          href="/reports/sales"
          className="group block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-3">
            <BarChart3 className="text-indigo-600 group-hover:text-indigo-800 dark:text-indigo-400" size={28} />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Sales Report
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View sales by date, branch, and payment method.
          </p>
        </Link>

        {/* Inventory Report Card */}
        <Link
          href="/reports/inventory"
          className="group block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-3">
            <FileText className="text-purple-600 group-hover:text-purple-800 dark:text-purple-400" size={28} />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Inventory Movement Report
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track inventory movement, purchases, sales, and stock levels.
          </p>
        </Link>
      </div>
    </div>
  );
}
