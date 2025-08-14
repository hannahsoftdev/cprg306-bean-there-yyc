"use client";
import { useEffect, useMemo, useState } from "react";
import CafeCard from "@/components/CafeCard";
import { loadStamps, saveStamps } from "@/lib/storage";

export default function CafesPage() {
  const [cafes, setCafes] = useState([]);
  const [stamps, setStamps] = useState(new Set());
  const [q, setQ] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [sort, setSort] = useState("name-asc");
  const [stampedOnly, setStampedOnly] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get("q"); if (qParam) setQ(qParam);
    fetch("/cafes.json").then((r)=>r.json()).then(setCafes);
    setStamps(loadStamps());
  }, []);

  const neighborhoods = useMemo(
    () => Array.from(new Set(cafes.map((c)=>c.neighborhood).filter(Boolean))).sort(),
    [cafes]
  );

  const filtered = useMemo(() => {
    const hay = (c) => (
      (c.name||"") + " " + (c.neighborhood||"") + " " + (c.bestSellers||[]).join(" ")
    ).toLowerCase();

    let out = cafes.filter((c) => {
      if (q && !hay(c).includes(q.toLowerCase())) return false;
      if (neighborhood && c.neighborhood !== neighborhood) return false;
      if (stampedOnly && !stamps.has(c.id)) return false;
      return true;
    });

    out.sort((a,b)=>{
      if (sort==="name-asc") return (a.name||"").localeCompare(b.name||"");
      if (sort==="rating-desc") return (b.rating??0) - (a.rating??0);
      if (sort==="rating-asc")  return (a.rating??0) - (b.rating??0);
      return 0;
    });
    return out;
  }, [cafes, q, neighborhood, sort, stampedOnly, stamps]);

  function toggleStamp(id) {
    const s = new Set(stamps);
    s.has(id) ? s.delete(id) : s.add(id);
    setStamps(s); saveStamps(s);
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">Cafés</h1>

      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <form className="flex flex-wrap justify-center gap-3">
          <input
            className="border rounded-xl px-3 py-2 w-full sm:w-72"
            type="text"
            placeholder="Search name, drink, area..."
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
          <select className="border rounded-xl px-3 py-2" value={neighborhood} onChange={(e)=>setNeighborhood(e.target.value)}>
            <option value="">All neighborhoods</option>
            {neighborhoods.map((n)=>(<option key={n} value={n}>{n}</option>))}
          </select>
          <select className="border rounded-xl px-3 py-2" value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="name-asc">Sort: Name A–Z</option>
            <option value="rating-desc">Sort: Rating high→low</option>
            <option value="rating-asc">Sort: Rating low→high</option>
          </select>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={stampedOnly} onChange={(e)=>setStampedOnly(e.target.checked)} />
            Stamped only
          </label>
        </form>
      </div>

      <div className="space-y-6">
        {filtered.map((c)=>(
          <CafeCard key={c.id} cafe={c} stamped={stamps.has(c.id)} onToggleStamp={toggleStamp} />
        ))}
      </div>
    </div>
  );
}
