import Link from "next/link";
import type { ReactNode } from "react";

const nav = [
  ["Dashboard", "/dashboard"],
  ["Risks", "/risks"],
  ["Controls", "/controls"],
  ["Tasks", "/tasks"],
  ["Evidence", "/evidence"],
  ["Org Settings", "/settings/org"],
] as const;

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header style={{ display: "flex", gap: 12, padding: 16, borderBottom: "1px solid #ddd" }}>
        {nav.map(([title, href]) => (
          <Link key={href} href={href}>{title}</Link>
        ))}
      </header>
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  );
}
