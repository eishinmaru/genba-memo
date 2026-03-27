"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", icon: "🏠", label: "現場一覧" },
  { href: "/site/new", icon: "➕", label: "新規登録" },
  { href: "/settings", icon: "⚙️", label: "設定" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-30 shadow-lg print-hide">
      {TABS.map((t) => {
        const active = path === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 text-xs gap-0.5 transition-colors ${
              active ? "text-teal-600 font-bold bg-teal-50" : "text-gray-500"
            }`}
          >
            <span className="text-xl leading-none">{t.icon}</span>
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
