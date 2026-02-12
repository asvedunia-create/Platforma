'use client';
import { useEffect, useState } from 'react';

type Control = { id: string; code: string; title: string; status: string };

export default function ControlsPage() {
  const [items, setItems] = useState<Control[]>([]);
  const [page, setPage] = useState(1);
  const load = async () => setItems((await (await fetch(`/api/controls?page=${page}`)).json()).items);
  useEffect(() => { load(); }, [page]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between"><h1 className="text-2xl font-semibold">Controls</h1><a className="rounded bg-slate-900 px-3 py-2 text-white" href="/api/exports/controls">Export CSV</a></div>
      <form action={async (fd)=>{await fetch('/api/controls',{method:'POST',body:JSON.stringify(Object.fromEntries(fd.entries()))});load();}} className="grid grid-cols-2 gap-2 rounded bg-white p-4">
        <input name="code" placeholder="A.5.1" className="rounded border p-2" required />
        <input name="title" placeholder="Control title" className="rounded border p-2" required />
        <input name="description" placeholder="Description" className="rounded border p-2 col-span-2" required />
        <select name="status" className="rounded border p-2"><option>NOT_STARTED</option><option>IN_PROGRESS</option><option>IMPLEMENTED</option><option>NOT_APPLICABLE</option></select>
        <button className="rounded bg-emerald-600 p-2 text-white">Add Control</button>
      </form>
      <table className="w-full rounded bg-white text-sm"><thead><tr className="border-b"><th className="p-2 text-left">Code</th><th className="text-left">Title</th><th className="text-left">Status</th></tr></thead><tbody>{items.map((c)=><tr key={c.id} className="border-b"><td className="p-2">{c.code}</td><td>{c.title}</td><td>{c.status}</td></tr>)}</tbody></table>
      <div className="flex gap-2"><button onClick={()=>setPage((p)=>Math.max(1,p-1))}>Prev</button><span>{page}</span><button onClick={()=>setPage((p)=>p+1)}>Next</button></div>
    </div>
  );
}
