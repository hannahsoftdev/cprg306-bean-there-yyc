"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp.get("redirect") || "/";

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    loginUser(form.username, form.password);
    router.push(redirectTo);
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="border rounded-xl px-3 py-2 w-full"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded-xl px-3 py-2 w-full"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          autoComplete="current-password"
        />
        <button type="submit" className="w-full px-4 py-2 rounded-xl bg-amber-700 text-white">
          Sign In
        </button>
        <p className="text-xs text-center text-gray-500">
          Demo login accepts any username/password.
        </p>
      </form>
    </div>
  );
}

