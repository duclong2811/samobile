"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Tổng quan", exact: true },
  { href: "/admin/articles", label: "Bài viết", exact: false },
] as const;

export function AdminNav() {
  const pathname = usePathname();
  return <nav className="admin-nav" aria-label="Quản trị">
    {items.map((item) => {
      const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
      return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>{item.label}</Link>;
    })}
    <span className="admin-nav-soon" aria-disabled="true">Sản phẩm <small>sắp có</small></span>
    <span className="admin-nav-soon" aria-disabled="true">Quét tin tự động <small>sắp có</small></span>
  </nav>;
}
