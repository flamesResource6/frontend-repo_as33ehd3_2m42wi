import { useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function Composer({ onCreated }) {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!title.trim() || !prompt.trim()) return;
    setSubmitting(true);
    try {
      await fetch(`${API}/api/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, prompt, author: author || undefined })
      });
      setTitle(''); setPrompt('');
      onCreated?.();
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-slate-800 font-semibold">Start a new topic</h3>
      <div className="mt-3 grid gap-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-300" />
        <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Write the ethical question or prompt..." rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-300" />
        <div className="flex items-center gap-2">
          <input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Your name (optional)" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-300" />
          <button onClick={submit} disabled={submitting} className="px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-60">{submitting ? 'Posting...' : 'Post'}</button>
        </div>
      </div>
    </div>
  );
}
