"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function AppHeader() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setEmail(data?.user.email ?? null))
      .catch(() => {});
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Logo href="/dashboard" />
        <div className="flex min-w-0 items-center gap-2 text-sm">
          {email && (
            <span className="hidden min-w-0 items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 sm:flex">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold uppercase text-accent">
                {email[0]}
              </span>
              <span className="truncate text-ink-soft">{email}</span>
            </span>
          )}
          <button
            onClick={logout}
            className="shrink-0 rounded-full px-3 py-1.5 text-muted transition-colors hover:bg-sunken hover:text-ink"
          >
            登出
          </button>
        </div>
      </div>
    </header>
  );
}
