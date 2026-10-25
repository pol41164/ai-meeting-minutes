"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MeetingResult from "./MeetingResult";
import { AlertIcon } from "./icons";
import type { MeetingDetail } from "@/types/meeting";

export function MeetingSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <span className="h-4 w-40 animate-pulse rounded bg-sunken" />
      <span className="h-10 w-3/4 animate-pulse rounded-lg bg-sunken" />
      <span className="h-20 animate-pulse rounded-2xl bg-sunken" />
      <span className="h-40 animate-pulse rounded-2xl bg-sunken" />
    </div>
  );
}

export default function MeetingView() {
  const { id } = useParams<{ id: string }>();
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/meetings/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "讀取失敗");
        setMeeting(data.meeting);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-danger-soft text-xl text-danger">
          <AlertIcon />
        </span>
        <p className="font-medium">{error}</p>
        <Link href="/dashboard" className="text-sm font-medium text-accent hover:underline">
          回到我的會議
        </Link>
      </div>
    );
  }
  if (!meeting) return <MeetingSkeleton />;

  return <MeetingResult meeting={meeting} />;
}
