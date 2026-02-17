import type { ReactNode } from "react";

export type ColumnDef<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => ReactNode;
};

export function DataTable<T extends { id: string }>({
  rows,
  columns,
}: {
  rows: T[];
  columns: ColumnDef<T>[];
}) {
  return (
    <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>{columns.map((c) => <th key={String(c.key)} align="left">{c.label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} style={{ borderTop: "1px solid #eee" }}>
            {columns.map((c) => (
              <td key={String(c.key)}>{c.render ? c.render(row) : String(row[c.key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
