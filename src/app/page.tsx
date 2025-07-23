"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarWidth = isCollapsed ? 80 : 256; // 20 * 4 = 80px, 64 * 4 = 256px

  return (
    <div className="flex min-h-screen">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className="flex-1 p-6 transition-all"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <h1 className="text-2xl font-bold mb-4">Home Page</h1>
        <p>Welcome to the SmartPOS homepage!</p>
      </div>
    </div>
  );
}
