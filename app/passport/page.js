// app/passport/page.js
"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadStamps } from "@/lib/storage";

export default function PassportPage() {
  const [cafes, setCafes] = useState([]);
  const [stamps, setStamps] = useState(new Set());

  useEffect(() => {
    fetch("/cafes.json").then((r) => r.json()).then(setCafes);
    setStamps(loadStamps());
  }, []);

  const stamped = useMemo(
    () => cafes.filter((c) => stamps.has(c.id)),
    [cafes, stamps]
  );
  const pct = cafes.length ? Math.round((stamped.length / cafes.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Digital Passport</h1>
        <p className="text-gray-700">Track your visited cafés and completion progress.</p>
      </header>

      <section className="bg-white rounded-xl shadow p-6 text-center">
        <h2 className="text-lg font-semibold">Progress</h2>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-amber-700 h-3 rounded-full" style={{ width: pct + "%" }} />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {stamped.length} / {cafes.length} stamped ({pct}%)
          </p>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-center mb-3">Stamped Cafés</h2>
        {stamped.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {stamped.map((c) => (
              <Link
                key={c.id}
                className="block border rounded-xl p-3 hover:bg-gray-50 text-center"
                href={`/cafes/${encodeURIComponent(c.id)}`}
              >
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-gray-600">{c.neighborhood}</div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 text-center">
            No stamps yet. Visit a café and press “Stamp”.
          </p>
        )}
      </section>
    </div>
  );
}
