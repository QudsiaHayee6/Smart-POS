"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  ShoppingCart,
  Package,
  BarChart2,
  Users,
  Layers,
  ClipboardList,
  AlertCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isCollapsed: boolean;
}

const SidebarItem = ({ href, icon, label, isCollapsed }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        group relative flex items-center gap-2 px-3 py-1.5 rounded-md transition-all
        text-sm
        ${isActive
          ? "bg-white/20 text-white font-semibold"
          : "text-white/80 hover:bg-white/10 hover:text-white"}
        ${isCollapsed ? "justify-center" : ""}
      `}
    >
      <div className="text-lg">{icon}</div>
      {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
      {isCollapsed && (
        <span className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
          {label}
        </span>
      )}
    </Link>
  );
};

const SidebarSection = ({
  title,
  children,
  isCollapsed,
}: {
  title?: string;
  children: React.ReactNode;
  isCollapsed: boolean;
}) => (
  <div className="mb-4">
    {!isCollapsed && title && (
      <div className="text-xs font-semibold text-white/70 px-3 mb-2">
        {title}
      </div>
    )}
    <div className="space-y-1">{children}</div>
  </div>
);

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [role, setRole] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const hardcodedRole = "cashier"; // change to test different roles
    localStorage.setItem("role", hardcodedRole);
    setRole(hardcodedRole);
    setHasMounted(true);
  }, []);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  if (!hasMounted) return null;

  const isAdmin = role === "admin";
  const isCashier = role === "cashier";
  const isInventory = role === "inventory_manager";

  return (
    <aside
      className={`bg-gradient-to-r from-primary to-purple-600 h-screen border-r shadow-sm fixed top-0 left-0 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-52"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4">
        {!isCollapsed && (
          <span className="text-xl font-bold text-white">SmartPOS</span>
        )}
        <button onClick={toggleSidebar} className="text-white">
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 px-1">
        <SidebarSection isCollapsed={isCollapsed}>
          <SidebarItem
            href="/dashboard"
            label="Dashboard"
            icon={<Home size={20} />}
            isCollapsed={isCollapsed}
          />
          {(isAdmin || isCashier) && (
            <SidebarItem
              href="/sales"
              label="Sales"
              icon={<ShoppingCart size={20} />}
              isCollapsed={isCollapsed}
            />
          )}
          {(isAdmin || isInventory) && (
            <SidebarItem
              href="/products"
              label="Products"
              icon={<Package size={20} />}
              isCollapsed={isCollapsed}
            />
          )}
        </SidebarSection>

        {(isAdmin || isInventory) && (
          <SidebarSection title="Management" isCollapsed={isCollapsed}>
            <SidebarItem
              href="/inventory"
              label="Inventory"
              icon={<ClipboardList size={20} />}
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              href="/suppliers"
              label="Suppliers"
              icon={<Layers size={20} />}
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              href="/alerts"
              label="Low Stock Alerts"
              icon={<AlertCircle size={20} />}
              isCollapsed={isCollapsed}
            />
          </SidebarSection>
        )}

        {isAdmin && (
          <SidebarSection title="Admin Tools" isCollapsed={isCollapsed}>
            <SidebarItem
              href="/users"
              label="Users"
              icon={<Users size={20} />}
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              href="/reports"
              label="Reports"
              icon={<BarChart2 size={20} />}
              isCollapsed={isCollapsed}
            />
          </SidebarSection>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-3">
        <SidebarItem
          href="/logout"
          label="Logout"
          icon={<LogOut size={20} />}
          isCollapsed={isCollapsed}
        />
      </div>
    </aside>
  );
}
