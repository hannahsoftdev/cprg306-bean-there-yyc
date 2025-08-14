"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { addReview, loadReviews, loadStamps, saveStamps, stars } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function CafeDetail({ params }) {
  const cafeId = decodeURIComponent(params.id);
  const router = useRouter();

  const [cafes, setCafes] = useState([]);
  const [stamps, setStamps] = useState(new Set());
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", rating: "", comment: "" });
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/cafes.json").then((r) => r.json()).then(setCafes);
    setStamps(loadStamps());
    setUser(getCurrentUser());
  }, []);

  const cafe = useMemo(() => cafes.find((x)=>x.id===cafeId) || null, [cafes, cafeId]);

  useEffect(() => {
    if (cafe) setReviews(loadReviews(cafe.id));
  }, [cafe]);

  function ensureAuth(redirect) {
    const u = getCurrentUser();
    if (!u) {
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      return null;
    }
    return u;
  }

  function toggleStamp(id) {
    if (!ensureAuth(`/cafes/${encodeURIComponent(cafeId)}`)) return;
    const s = new Set(stamps);
    s.has(id) ? s.delete(id) : s.add(id);
    setStamps(s); saveStamps(s);
  }

  function submitReview(e) {
    e.preventDefault();
    if (!cafe) return;
    if (!ensureAuth(`/cafes/${encodeURIComponent(cafeId)}`)) return;

    const { name, rating, comment } = form;
    if (!name.trim() || !rating || !comment.trim()) return;

    const next = addReview(cafe.id, {
      name: name.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      date: new Date().toISOString(),
    });
    setReviews(next);
    setForm({ name: "", rating: "", comment: "" });
  }

  if (!cafe) return <p>Loading…</p>;
  const stamped = stamps.has(cafe.id);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Link href="/cafes" className="text-sm underline">← Back to all cafés</Link>
      </div>

      <section className="bg-white rounded-xl shadow p-6 text-center space-y-2">
        <h1 className="text-2xl font-bold">{cafe.name}</h1>
        <p className="text-gray-600">{cafe.address}</p>
        <p className="text-gray-600">Hours: {cafe.hours}</p>
        <p className="text-gray-600">Neighborhood: {cafe.neighborhood}</p>
        <p className="text-gray-700">
          Rating: <span title={cafe.rating}>{stars(cafe.rating)}</span> ({(cafe.rating ?? 0).toFixed(1)})
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {(cafe.bestSellers || []).map((d) => (
            <span key={d} className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100">{d}</span>
          ))}
        </div>
        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={()=>toggleStamp(cafe.id)}
            className={`px-4 py-2 rounded-xl ${stamped ? "bg-emerald-600 text-white" : "bg-gray-900 text-white"}`}
          >
            {stamped ? "Stamped" : "Stamp this café"}
          </button>
          <a
            className="px-4 py-2 rounded-xl border"
            target="_blank"
            rel="noreferrer"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name + " " + cafe.address)}`}
          >
            Open in Maps
          </a>
        </div>

        {!user && (
          <p className="text-xs text-gray-500 mt-2">
            Please <a className="underline" href={`/login?redirect=${encodeURIComponent(`/cafes/${cafeId}`)}`}>log in</a> to stamp or post a review.
          </p>
        )}
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Reviews</h2>
        <div className="space-y-3">
          {reviews.length ? reviews.map((r,i)=>(
            <div key={i} className="p-3 rounded-xl bg-gray-50">
              <div className="text-sm font-medium text-center">{r.name} • <span title={r.rating}>{stars(r.rating)}</span></div>
              <div className="text-sm text-gray-700 mt-1 text-center">{r.comment}</div>
              <div className="text-xs text-gray-500 mt-1 text-center">{new Date(r.date).toLocaleString()}</div>
            </div>
          )) : <p className="text-sm text-gray-600 text-center">No reviews yet. Be the first!</p>}
        </div>

        <form onSubmit={submitReview} className="mt-6 grid gap-3 sm:grid-cols-2">
          <input
            className="border rounded-xl px-3 py-2"
            type="text"
            placeholder="Your name"
            required
            value={form.name}
            onChange={(e)=>setForm({ ...form, name: e.target.value })}
            disabled={!user}
          />
          <select
            className="border rounded-xl px-3 py-2"
            required
            value={form.rating}
            onChange={(e)=>setForm({ ...form, rating: e.target.value })}
            disabled={!user}
          >
            <option value="">Rating</option>
            <option>5</option><option>4</option><option>3</option><option>2</option><option>1</option>
          </select>
          <textarea
            className="sm:col-span-2 border rounded-xl px-3 py-2"
            placeholder="Share your thoughts..."
            required
            value={form.comment}
            onChange={(e)=>setForm({ ...form, comment: e.target.value })}
            disabled={!user}
          />
          <button type="submit" className="sm:col-span-2 px-4 py-2 rounded-xl bg-amber-700 text-white disabled:opacity-50" disabled={!user}>
            Submit Review
          </button>
        </form>
      </section>
    </div>
  );
}
