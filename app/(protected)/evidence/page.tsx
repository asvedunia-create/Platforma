'use client';
import { useEffect, useState } from 'react';

type Evidence = { id: string; title: string; type: string; fileUrl: string | null };

export default function EvidencePage() {
  const [items, setItems] = useState<Evidence[]>([]);
  const [page, setPage] = useState(1);
  const load = async () => setItems((await (await fetch(`/api/evidence?page=${page}`)).json()).items);
  useEffect(() => { load(); }, [page]);

  return <div className="space-y-4">
    <h1 className="text-2xl font-semibold">Evidence</h1>
    <form action={async (fd)=>{await fetch('/api/evidence',{method:'POST',body:JSON.stringify(Object.fromEntries(fd.entries()))});load();}} className="grid grid-cols-2 gap-2 rounded bg-white p-4">
      <input name="title" className="rounded border p-2" placeholder="Evidence title" required />
      <select name="type" className="rounded border p-2"><option>POLICY</option><option>SCREENSHOT</option><option>TICKET</option><option>LOG</option><option>CONTRACT</option><option>OTHER</option></select>
      <input name="description" className="rounded border p-2 col-span-2" placeholder="Description" />
      <input name="fileName" className="rounded border p-2" placeholder="File name" />
      <input name="fileUrl" className="rounded border p-2" placeholder="File URL" />
      <input name="riskId" className="rounded border p-2" placeholder="Risk ID" />
      <input name="controlId" className="rounded border p-2" placeholder="Control ID" />
      <input name="taskId" className="rounded border p-2" placeholder="Task ID" />
      <button className="rounded bg-emerald-600 p-2 text-white">Add Evidence</button>
    </form>
    <table className="w-full rounded bg-white text-sm"><thead><tr className="border-b"><th className="p-2 text-left">Title</th><th className="text-left">Type</th><th className="text-left">URL</th></tr></thead><tbody>{items.map((e)=><tr key={e.id} className="border-b"><td className="p-2">{e.title}</td><td>{e.type}</td><td>{e.fileUrl}</td></tr>)}</tbody></table>
    <div className="flex gap-2"><button onClick={()=>setPage((p)=>Math.max(1,p-1))}>Prev</button><span>{page}</span><button onClick={()=>setPage((p)=>p+1)}>Next</button></div>
  </div>;
}
