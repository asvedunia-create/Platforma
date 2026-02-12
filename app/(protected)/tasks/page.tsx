'use client';
import { useEffect, useState } from 'react';

type Task = { id: string; title: string; status: string; dueDate: string | null };

export default function TasksPage() {
  const [items, setItems] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const load = async () => setItems((await (await fetch(`/api/tasks?page=${page}`)).json()).items);
  useEffect(() => { load(); }, [page]);

  return <div className="space-y-4">
    <h1 className="text-2xl font-semibold">Tasks</h1>
    <form action={async (fd)=>{await fetch('/api/tasks',{method:'POST',body:JSON.stringify(Object.fromEntries(fd.entries()))});load();}} className="grid grid-cols-2 gap-2 rounded bg-white p-4">
      <input name="title" className="rounded border p-2" placeholder="Task title" required />
      <select name="status" className="rounded border p-2"><option>TODO</option><option>IN_PROGRESS</option><option>DONE</option></select>
      <input name="description" className="rounded border p-2 col-span-2" placeholder="Description" />
      <input name="riskId" className="rounded border p-2" placeholder="Risk ID (optional)" />
      <input name="controlId" className="rounded border p-2" placeholder="Control ID (optional)" />
      <input name="assigneeId" className="rounded border p-2" placeholder="Assignee user ID" />
      <input name="dueDate" type="date" className="rounded border p-2" />
      <button className="rounded bg-emerald-600 p-2 text-white">Add Task</button>
    </form>
    <table className="w-full rounded bg-white text-sm"><thead><tr className="border-b"><th className="p-2 text-left">Title</th><th className="text-left">Status</th><th className="text-left">Due</th></tr></thead><tbody>{items.map((t)=><tr key={t.id} className="border-b"><td className="p-2">{t.title}</td><td>{t.status}</td><td>{t.dueDate?.slice(0,10)}</td></tr>)}</tbody></table>
    <div className="flex gap-2"><button onClick={()=>setPage((p)=>Math.max(1,p-1))}>Prev</button><span>{page}</span><button onClick={()=>setPage((p)=>p+1)}>Next</button></div>
  </div>;
}
