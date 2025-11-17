import { useState } from 'react';
import Hero from './components/Hero';
import TopicList from './components/TopicList';
import Composer from './components/Composer';

export default function App() {
  const [selected, setSelected] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-sky-50 to-violet-50">
      <Hero />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {!selected && (
          <div className="grid gap-6">
            <Composer onCreated={() => setRefreshKey(k => k + 1)} />
            <TopicList key={refreshKey} onSelect={setSelected} />
          </div>
        )}
        {selected && (
          <div className="grid gap-6">
            <TopicDetailWrapper topic={selected} onBack={() => setSelected(null)} />
          </div>
        )}
      </main>
      <footer className="py-8 text-center text-slate-500">Made for thoughtful, respectful debate • Pastel vibes ✨</footer>
    </div>
  );
}

import TopicDetail from './components/TopicDetail';
function TopicDetailWrapper({ topic, onBack }) {
  // Keep topic live by merging updated counts when navigating back and forth if needed
  return <TopicDetail topic={topic} onBack={onBack} />;
}
