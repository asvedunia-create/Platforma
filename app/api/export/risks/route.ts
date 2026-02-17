import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const session = await requireSession();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;

  const risks = await db.risk.findMany({
    where: {
      orgId: session.user.activeOrgId,
      ...(status ? { status: status as any } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const csv = [
    ["id", "title", "status", "owner", "riskScore"],
    ...risks.map((r) => [r.id, r.title, r.status, r.owner ?? "", String(r.riskScore)]),
  ]
    .map((row) => row.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="risks.csv"',
    },
  });
}
