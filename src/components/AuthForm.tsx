"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { AlertIcon, CheckIcon } from "./icons";

const inputClass =
  "h-12 w-full rounded-xl border border-line-strong bg-surface px-4 text-base text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent focus:ring-4 focus:ring-accent/15";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRegister = mode === "register";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "發生錯誤");
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
      setLoading(false);
    }
  }

  return (
    <div className="grid flex-1 lg:grid-cols-2">
      {/* 左側品牌區，手機隱藏 */}
      <aside className="relative hidden overflow-hidden bg-ink p-12 text-paper lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="absolute -right-24 top-1/3 size-96 rounded-full bg-accent/25 blur-3xl" />
        <div className="relative">
          <Logo inverse />
        </div>
        <div className="relative flex flex-col gap-8">
          <p className="font-serif text-4xl font-black leading-tight">
            專心開會，
            <br />
            記錄交給 AI。
          </p>
          <ul className="flex flex-col gap-3 text-paper/75">
            {["上傳錄音，自動產生繁體中文逐字稿", "整理出摘要、重點與待辦事項", "所有記錄只有你自己看得到"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid size-6 place-items-center rounded-full bg-accent text-accent-ink">
                  <CheckIcon className="text-sm" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-paper/50">© 2026 AI 會議記錄</p>
      </aside>

      <main className="flex flex-col px-4 py-6 sm:px-8">
        <div className="lg:hidden">
          <Logo />
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 animate-rise flex-col justify-center gap-8 py-12">
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-3xl font-black">{isRegister ? "建立帳號" : "歡迎回來"}</h1>
            <p className="text-muted">
              {isRegister ? "只需要 Email 和密碼，馬上開始整理會議記錄。" : "登入後繼續上傳錄音、查看你的會議記錄。"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {isRegister && (
              <label className="flex flex-col gap-2 text-sm font-medium text-ink-soft">
                名稱 <span className="sr-only">（選填）</span>
                <input name="name" autoComplete="name" placeholder="怎麼稱呼你（選填）" className={inputClass} />
              </label>
            )}
            <label className="flex flex-col gap-2 text-sm font-medium text-ink-soft">
              Email
              <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputClass} />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-ink-soft">
              密碼
              <input
                name="password"
                type="password"
                required
                minLength={isRegister ? 8 : undefined}
                autoComplete={isRegister ? "new-password" : "current-password"}
                placeholder={isRegister ? "至少 8 個字元" : "輸入密碼"}
                className={inputClass}
              />
            </label>

            {error && (
              <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
                <AlertIcon className="mt-0.5 shrink-0" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 h-12 rounded-full bg-accent font-medium text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {loading ? "處理中…" : isRegister ? "建立帳號" : "登入"}
            </button>
          </form>

          <p className="text-center text-sm text-muted">
            {isRegister ? "已經有帳號？" : "還沒有帳號？"}
            <Link href={isRegister ? "/login" : "/register"} className="ml-1 font-medium text-accent hover:underline">
              {isRegister ? "登入" : "免費註冊"}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
