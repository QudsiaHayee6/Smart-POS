'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  FileText,
  ChevronDown,
} from 'lucide-react';

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
      className={`group relative flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-300 text-sm font-medium
        transform hover:scale-[1.04]
        ${isActive ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-900 shadow' : 'text-purple-800 hover:bg-[#ebe3ff] hover:text-purple-700'}
        ${isCollapsed ? 'justify-center px-3' : ''}
      `}
    >
      <div className="text-[16px] text-purple-400 group-hover:text-purple-600 transition duration-300 group-hover:animate-bounce-short">
        {icon}
      </div>
      {!isCollapsed && <span className="text-sm">{label}</span>}
      {isCollapsed && (
        <span className="absolute left-full ml-2 z-10 rounded bg-white px-2 py-1 text-xs text-purple-700 shadow opacity-0 group-hover:opacity-100 transition">
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
  <div className="mb-3">
    {!isCollapsed && title && (
      <div className="text-xs font-semibold text-purple-400 px-2 mb-1 uppercase tracking-wide">
        {title}
      </div>
    )}
    <div className="space-y-[4px]">{children}</div>
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
  const [expandedReports, setExpandedReports] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    setRole(savedRole);
    setHasMounted(true);
  }, []);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  if (!hasMounted) return null;

  const isAdmin = role === 'admin';
  const isCashier = role === 'cashier';
  const isInventory = role === 'inventory_manager';

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 transition-all duration-500 ease-in-out
        bg-gradient-to-br from-white via-[#f3e8ff] to-[#dcd0ff] border-r border-purple-200 shadow-lg
        ${isCollapsed ? 'w-[48px]' : 'w-[170px]'}
        py-2 px-1 flex flex-col rounded-r-xl
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 mb-2">
        {!isCollapsed && (
          <span className="text-base font-bold text-purple-700 tracking-tight">
            Smart<span className="text-purple-500">POS</span>
          </span>
        )}
        <button onClick={toggleSidebar} className="text-purple-300 hover:text-purple-500 transition-colors">
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <SidebarSection isCollapsed={isCollapsed}>
          <SidebarItem href="/dashboard" label="Dashboard" icon={<Home size={15} />} isCollapsed={isCollapsed} />
          {(isAdmin || isCashier) && (
            <SidebarItem href="/sales" label="Sales" icon={<ShoppingCart size={15} />} isCollapsed={isCollapsed} />
          )}
          {(isAdmin || isCashier) && (
            <SidebarItem href="/orders" label="Orders" icon={<FileText size={15} />} isCollapsed={isCollapsed} />
          )}
          {(isAdmin || isInventory) && (
            <SidebarItem href="/products" label="Products" icon={<Package size={15} />} isCollapsed={isCollapsed} />
          )}
        </SidebarSection>

        {(isAdmin || isInventory) && (
          <SidebarSection title="Management" isCollapsed={isCollapsed}>
            <SidebarItem href="/inventory" label="Inventory" icon={<ClipboardList size={15} />} isCollapsed={isCollapsed} />
            <SidebarItem href="/suppliers" label="Suppliers" icon={<Layers size={15} />} isCollapsed={isCollapsed} />
            <SidebarItem href="/alerts" label="Low Stock Alerts" icon={<AlertCircle size={15} />} isCollapsed={isCollapsed} />
          </SidebarSection>
        )}

        {isAdmin && (
          <SidebarSection title="Admin Tools" isCollapsed={isCollapsed}>
            <SidebarItem href="/users" label="Users" icon={<Users size={15} />} isCollapsed={isCollapsed} />

            {/* Reports */}
            <div className="group relative">
              <button
                onClick={() => setExpandedReports((prev) => !prev)}
                className={`group relative flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-300 text-sm font-medium
                  transform hover:scale-[1.04]
                  text-purple-800 hover:bg-[#ebe3ff] hover:text-purple-700
                  ${isCollapsed ? 'justify-center px-3' : ''}
                `}
              >
                <div className="text-[16px] text-purple-400 group-hover:text-purple-600 transition duration-300 group-hover:animate-bounce-short">
                  <BarChart2 size={15} />
                </div>
                {!isCollapsed && <span>Reports</span>}
                {!isCollapsed && (
                  <ChevronDown
                    size={12}
                    className={`ml-auto transition-transform duration-300 ${expandedReports ? 'rotate-180' : ''}`}
                  />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ${
                  expandedReports ? 'max-h-40 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
                } ease-in-out`}
                style={{
                  transitionProperty: 'max-height, opacity, transform',
                }}
              >
                <div className="ml-6 mt-1 space-y-1">
                  <Link href="/reports/sales" className="block text-xs text-gray-500 hover:text-purple-700 transition-transform duration-300 hover:translate-x-2">
                    Sales Report
                  </Link>
                  <Link href="/reports/inventory" className="block text-xs text-gray-500 hover:text-purple-700 transition-transform duration-300 hover:translate-x-2">
                    Inventory Movement
                  </Link>
                </div>
              </div>
            </div>
          </SidebarSection>
        )}
      </div>

      {/* Footer */}
      <div className="px-2 border-t pt-1">
        <SidebarItem href="/logout" label="Logout" icon={<LogOut size={15} />} isCollapsed={isCollapsed} />
      </div>

      {/* Bounce animation */}
      <style jsx global>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
          60% { transform: translateY(2px); }
        }
        .animate-bounce-short {
          animation: bounce-short 0.5s;
        }
      `}</style>
    </aside>
  );
}
