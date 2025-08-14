"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default function CafeCard({ cafe, stamped, onToggleStamp }) {
  const router = useRouter();
  const starStr = (() => {
    const n = Math.round(Number(cafe.rating ?? 0));
    return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
  })();

  function onStamp() {
    const user = getCurrentUser();
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/cafes")}`);
      return;
    }
    onToggleStamp?.(cafe.id);
  }

  return (
    <article className="bg-white rounded-xl shadow p-5">
      <h3 className="text-xl font-semibold text-center sm:text-left">{cafe.name}</h3>
      <p className="text-gray-600 mt-1 text-center sm:text-left">
        {cafe.neighborhood} • <span title={cafe.rating}>{starStr}</span>
      </p>
      <p className="text-gray-700 mt-2 text-center sm:text-left">{cafe.address}</p>
      <p className="text-gray-600 mt-1 text-center sm:text-left">Hours: {cafe.hours}</p>

      <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
        {(cafe.bestSellers || []).map((d) => (
          <span key={d} className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100">
            {d}
          </span>
        ))}
      </div>

      <div className="mt-5 flex justify-center gap-3">
        <Link href={`/cafes/${encodeURIComponent(cafe.id)}`} className="px-3 py-2 rounded-lg border text-sm">
          Details
        </Link>
        <button
          type="button"
          onClick={onStamp}
          className={`px-3 py-2 rounded-lg text-sm ${stamped ? "bg-emerald-600 text-white" : "bg-gray-900 text-white"}`}
        >
          {stamped ? "Stamped" : "Stamp"}
        </button>
      </div>
    </article>
  );
}
