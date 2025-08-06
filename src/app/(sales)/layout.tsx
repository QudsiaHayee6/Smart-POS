// app/(dashboard)/layout.tsx
"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarWidth = isCollapsed ? 48 : 170; // match Sidebar's Tailwind width

  return (
    <>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        className="transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {children}
      </main>
    </>
  );
}
