import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function PostItem({ post, onLike }) {
  return (
    <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-xl p-4">
      <p className="text-slate-800 whitespace-pre-wrap">{post.content}</p>
      <div className="flex items-center justify-between mt-3 text-sm">
        <span className="text-slate-600">by {post.author || 'Anonymous'}</span>
        <button onClick={() => onLike(post.id)} className="px-3 py-1.5 rounded-lg bg-fuchsia-500 text-white hover:bg-fuchsia-600">Like {post.like_count ?? 0}</button>
      </div>
    </div>
  );
}

function Comment({ c }) {
  return (
    <div className="pl-3 border-l-2 border-slate-200">
      <p className="text-slate-700 text-sm">{c.content}</p>
      <p className="text-slate-500 text-xs mt-1">by {c.author || 'Anonymous'}</p>
    </div>
  );
}

export default function TopicDetail({ topic, onBack }) {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [text, setText] = useState('');
  const [name, setName] = useState('');

  async function fetchPosts() {
    const res = await fetch(`${API}/api/topics/${topic.id}/posts`);
    const data = await res.json();
    setPosts(data);
  }

  async function fetchComments(postId) {
    const res = await fetch(`${API}/api/posts/${postId}/comments`);
    const data = await res.json();
    setComments(prev => ({ ...prev, [postId]: data }));
  }

  useEffect(() => { fetchPosts(); }, [topic.id]);

  async function createPost() {
    if (!text.trim()) return;
    await fetch(`${API}/api/posts`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic_id: topic.id, content: text, author: name || undefined })
    });
    setText('');
    fetchPosts();
  }

  async function likePost(id) {
    await fetch(`${API}/api/posts/${id}/like`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like' })
    });
    fetchPosts();
  }

  async function addComment(postId, value) {
    if (!value.trim()) return;
    await fetch(`${API}/api/comments`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId, content: value, author: name || undefined })
    });
    fetchComments(postId);
  }

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-sky-600 hover:underline">← Back to topics</button>
      <div className="bg-gradient-to-br from-pink-50 to-sky-50 border border-slate-200 rounded-2xl p-5">
        <h2 className="text-2xl font-semibold text-slate-800">{topic.title}</h2>
        <p className="text-slate-700 mt-2">{topic.prompt}</p>
        <div className="mt-3 flex gap-2 text-sm">
          <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">Agree {topic.agree_count ?? 0}</span>
          <span className="px-2 py-1 rounded-full bg-rose-50 text-rose-700">Disagree {topic.disagree_count ?? 0}</span>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-xl p-4">
        <h3 className="font-semibold text-slate-800">Write a post</h3>
        <div className="mt-2 grid gap-2">
          <textarea value={text} onChange={e=>setText(e.target.value)} rows={3} placeholder="Share your perspective..." className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-fuchsia-300" />
          <div className="flex items-center gap-2">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name (optional)" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-fuchsia-300" />
            <button onClick={createPost} className="px-4 py-2 rounded-lg bg-fuchsia-500 text-white hover:bg-fuchsia-600">Post</button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {posts.map(p => (
          <div key={p.id} className="space-y-2">
            <PostItem post={p} onLike={likePost} />
            <div className="pl-2">
              <button onClick={() => fetchComments(p.id)} className="text-sky-600 text-sm hover:underline">View comments</button>
              <div className="mt-2 space-y-2">
                {(comments[p.id] || []).map(c => (
                  <Comment key={c.id} c={c} />
                ))}
                <AddComment onAdd={(val) => addComment(p.id, val)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddComment({ onAdd }) {
  const [value, setValue] = useState('');
  return (
    <div className="flex items-center gap-2">
      <input value={value} onChange={e=>setValue(e.target.value)} placeholder="Add a comment" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-300" />
      <button onClick={() => { onAdd(value); setValue(''); }} className="px-3 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600">Comment</button>
    </div>
  );
}
