import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function TopicCard({ topic, onVote, onSelect }) {
  return (
    <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-slate-800">{topic.title}</h3>
      <p className="text-slate-600 mt-1 line-clamp-3">{topic.prompt}</p>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3 text-sm text-slate-700">
          <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">Agree {topic.agree_count ?? 0}</span>
          <span className="px-2 py-1 rounded-full bg-rose-50 text-rose-700">Disagree {topic.disagree_count ?? 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onVote(topic.id, 'agree')} className="px-3 py-1.5 text-sm rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">Agree</button>
          <button onClick={() => onVote(topic.id, 'disagree')} className="px-3 py-1.5 text-sm rounded-lg bg-rose-500 text-white hover:bg-rose-600">Disagree</button>
          <button onClick={() => onSelect(topic)} className="px-3 py-1.5 text-sm rounded-lg bg-sky-500 text-white hover:bg-sky-600">Open</button>
        </div>
      </div>
    </div>
  );
}

export default function TopicList({ onSelect }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTopics() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/topics`);
      const data = await res.json();
      setTopics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTopics(); }, []);

  async function handleVote(id, vote) {
    try {
      await fetch(`${API}/api/topics/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote })
      });
      fetchTopics();
    } catch (e) { console.error(e); }
  }

  if (loading) return <div className="text-slate-600">Loading topics...</div>;
  if (!topics.length) return <div className="text-slate-600">No topics yet. Be the first to create one!</div>;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {topics.map(t => (
        <TopicCard key={t.id} topic={t} onVote={handleVote} onSelect={onSelect} />
      ))}
    </div>
  );
}
