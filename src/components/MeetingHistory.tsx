"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertIcon, ArrowRightIcon, DocIcon, WaveIcon } from "./icons";
import type { MeetingListItem } from "@/types/meeting";

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("zh-TW", { day: "numeric" }).replace("日", ""),
    month: d.toLocaleDateString("zh-TW", { month: "short" }),
    time: d.toLocaleString("zh-TW", { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }),
  };
}

function Skeleton() {
  return (
    <ul className="flex flex-col gap-3" aria-hidden>
      {[0, 1, 2].map((i) => (
        <li key={i} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
          <span className="size-14 shrink-0 animate-pulse rounded-xl bg-sunken" />
          <span className="flex flex-1 flex-col gap-2 py-1">
            <span className="h-4 w-1/2 animate-pulse rounded bg-sunken" />
            <span className="h-3 w-full animate-pulse rounded bg-sunken" />
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function MeetingHistory() {
  const [meetings, setMeetings] = useState<MeetingListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/meetings")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "讀取失敗");
        if (!cancelled) setMeetings(data.meetings);
      })
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-black">歷史記錄</h2>
          <p className="mt-1 text-sm text-muted">只有你看得到自己上傳的會議。</p>
        </div>
        {meetings && meetings.length > 0 && (
          <span className="shrink-0 rounded-full bg-sunken px-3 py-1 font-mono text-xs text-ink-soft">
            {meetings.length} 場
          </span>
        )}
      </div>

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          <AlertIcon className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      {!meetings && !error && <Skeleton />}

      {meetings?.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-sunken text-xl text-muted">
            <DocIcon />
          </span>
          <p className="font-medium">還沒有會議記錄</p>
          <p className="text-sm text-muted">上傳第一段錄音，整理好的記錄會出現在這裡。</p>
        </div>
      )}

      {meetings && meetings.length > 0 && (
        <ul className="flex flex-col gap-3">
          {meetings.map((m) => {
            const date = formatDate(m.createdAt);
            return (
              <li key={m.id}>
                <Link
                  href={`/meetings/${m.id}`}
                  className="group flex gap-4 rounded-2xl border border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_16px_32px_-24px_rgb(60_40_20/0.4)]"
                >
                  {/* 日曆式日期 */}
                  <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl border border-line bg-paper">
                    <span className="text-[10px] font-bold text-accent">{date.month}</span>
                    <span className="font-serif text-xl font-black leading-none">{date.day}</span>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="min-w-0 truncate font-bold">{m.title}</p>
                      {m.hasAudio && <WaveIcon className="shrink-0 text-muted" aria-label="有錄音檔" />}
                    </div>
                    {m.summaryPreview ? (
                      <p className="line-clamp-2 text-sm leading-6 text-muted">{m.summaryPreview}</p>
                    ) : m.status === "failed" ? (
                      <p className="flex items-center gap-1.5 text-sm text-warn">
                        <AlertIcon className="shrink-0" />
                        AI 整理失敗，僅有逐字稿
                      </p>
                    ) : null}
                    <p className="text-xs text-muted/80">{date.time}</p>
                  </div>

                  <ArrowRightIcon className="hidden shrink-0 self-center text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent sm:block" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
