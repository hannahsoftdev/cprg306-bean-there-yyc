"use client";
import { useEffect, useMemo, useState } from "react";
import CafeCard from "@/components/CafeCard";
import { loadStamps, saveStamps } from "@/lib/storage";

export default function HomePage() {
  const [cafes, setCafes] = useState([]);
  const [stamps, setStamps] = useState(new Set());
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/cafes.json").then((r) => r.json()).then(setCafes);
    setStamps(loadStamps());
  }, []);

  const top = useMemo(
    () => [...cafes].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 4),
    [cafes]
  );

  function toggleStamp(id) {
    const s = new Set(stamps);
    s.has(id) ? s.delete(id) : s.add(id);
    setStamps(s); saveStamps(s);
  }

  function onQuickSearch(e) {
    e.preventDefault();
    window.location.href = q.trim() ? `/cafes?q=${encodeURIComponent(q.trim())}` : "/cafes";
  }

  return (
    <div className="space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Sip. Stamp. Explore Calgary’s café scene.</h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Find local cafés, see what’s popular, leave reviews, and collect digital stamps—just like a café passport.
        </p>
        <div className="flex justify-center gap-3">
          <a href="/cafes" className="px-4 py-2 rounded-xl bg-amber-700 text-white font-medium">Browse Cafés</a>
          <a href="/passport" className="px-4 py-2 rounded-xl bg-white border font-medium">View Passport</a>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-5">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100">Featured</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {top.map((c) => (
            <CafeCard key={c.id} cafe={c} stamped={stamps.has(c.id)} onToggleStamp={toggleStamp} />
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-semibold text-center mb-4">Quick Search</h2>
        <form onSubmit={onQuickSearch} className="flex flex-col sm:flex-row justify-center gap-3">
          <input
            className="w-full sm:w-80 border rounded-xl px-3 py-2"
            type="text"
            placeholder='Try "latte" or "Beltline"'
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-gray-900 text-white">Search</button>
        </form>
      </section>
    </div>
  );
}
