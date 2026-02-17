export function StatusBadge({ status }: { status: string }) {
  return <span style={{ padding: "2px 8px", borderRadius: 999, background: "#eef" }}>{status}</span>;
}

export function RiskScorePill({ score }: { score: number }) {
  return <strong style={{ color: score > 12 ? "#b00" : "#333" }}>{score}</strong>;
}

export function DueDateChip({ dueDate }: { dueDate?: string | null }) {
  return <span>{dueDate ? new Date(dueDate).toLocaleDateString() : "—"}</span>;
}
