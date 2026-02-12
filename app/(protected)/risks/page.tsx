'use client';
import { useEffect, useState } from 'react';

type Risk = { id: string; assetProcess: string; threat: string; vulnerability: string; impact: number; likelihood: number; riskScore: number; treatment: string; dueDate: string | null; status: string };

export default function RisksPage() {
  const [items, setItems] = useState<Risk[]>([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  async function load() {
    const res = await fetch(`/api/risks?page=${page}&status=${status}&sortBy=riskScore&order=desc`);
    const data = await res.json();
    setItems(data.items);
  }
  useEffect(() => { load(); }, [page, status]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Risk Register</h1>
        <a className="rounded bg-slate-900 px-3 py-2 text-white" href="/api/exports/risks">Export CSV</a>
      </div>
      <form action={async (fd) => {
        await fetch('/api/risks', { method: 'POST', body: JSON.stringify(Object.fromEntries(fd.entries())) });
        await load();
      }} className="grid grid-cols-2 gap-2 rounded bg-white p-4">
        <input required name="assetProcess" placeholder="Asset/Process" className="rounded border p-2" />
        <input required name="threat" placeholder="Threat" className="rounded border p-2" />
        <input required name="vulnerability" placeholder="Vulnerability" className="rounded border p-2" />
        <input required name="impact" type="number" min={1} max={5} placeholder="Impact" className="rounded border p-2" />
        <input required name="likelihood" type="number" min={1} max={5} placeholder="Likelihood" className="rounded border p-2" />
        <select name="treatment" className="rounded border p-2"><option>MITIGATE</option><option>AVOID</option><option>TRANSFER</option><option>ACCEPT</option></select>
        <select name="status" className="rounded border p-2"><option>OPEN</option><option>IN_PROGRESS</option><option>CLOSED</option></select>
        <input name="dueDate" type="date" className="rounded border p-2" />
        <button className="rounded bg-emerald-600 px-3 py-2 text-white">Add Risk</button>
      </form>
      <div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded border p-2">
          <option value="">All status</option><option value="OPEN">OPEN</option><option value="IN_PROGRESS">IN_PROGRESS</option><option value="CLOSED">CLOSED</option>
        </select>
      </div>
      <table className="w-full rounded bg-white text-sm">
        <thead><tr className="border-b text-left"><th className="p-2">Asset</th><th>Threat</th><th>Score</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {items.map((r) => <tr key={r.id} className="border-b"><td className="p-2">{r.assetProcess}</td><td>{r.threat}</td><td>{r.riskScore}</td><td>{r.status}</td><td><button onClick={async()=>{await fetch(`/api/risks?id=${r.id}`,{method:'DELETE'});load();}} className="text-red-600">Delete</button></td></tr>)}
        </tbody>
      </table>
      <div className="flex gap-2"><button onClick={()=>setPage((p)=>Math.max(1,p-1))}>Prev</button><span>{page}</span><button onClick={()=>setPage((p)=>p+1)}>Next</button></div>
    </div>
  );
}
