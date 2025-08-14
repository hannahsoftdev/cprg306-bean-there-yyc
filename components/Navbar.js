"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser, USER_KEY } from "@/lib/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
    const onStorage = (e) => {
      if (!e || e.key === USER_KEY) setUser(getCurrentUser());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <header className="bg-white border-b">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          Bean There <span className="text-amber-700">YYC</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link className="hover:underline" href="/">Home</Link>
          <Link className="hover:underline" href="/cafes">Cafés</Link>
          <Link className="hover:underline" href="/passport">Passport</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-700">Hi, <b>{user.username}</b></span>
              <button
                type="button"
                className="text-sm px-3 py-1 rounded-lg border"
                onClick={logoutUser}
                title="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <Link className="text-sm px-3 py-1 rounded-lg border" href="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
