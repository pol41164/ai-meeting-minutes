"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AlertIcon, ArrowRightIcon, DocIcon, SparkIcon, UploadIcon, WaveIcon, XIcon } from "./icons";

// 跟 API 的檢查一致，先在前端擋掉，省一次上傳
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["mp3", "mp4", "mpeg", "mpga", "m4a", "wav", "webm", "ogg", "flac"];

const STAGES = [
  { icon: UploadIcon, label: "上傳錄音" },
  { icon: DocIcon, label: "轉成逐字稿" },
  { icon: SparkIcon, label: "AI 整理重點" },
];

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function validate(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.includes(ext)) return `不支援 .${ext} 格式，請上傳 ${ALLOWED_EXTENSIONS.join("、")}`;
  if (file.size > MAX_FILE_SIZE) return `檔案 ${formatSize(file.size)}，超過 25MB 上限`;
  return null;
}

export default function TranscribeForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 處理中顯示經過秒數
  useEffect(() => {
    if (!loading) return;
    const start = Date.now();
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [loading]);

  function pick(next: File | undefined) {
    if (!next) return;
    const problem = validate(next);
    setError(problem);
    setFile(problem ? null : next);
  }

  function clear() {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setElapsed(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "上傳失敗");
      router.push(`/meetings/${data.meeting.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上傳失敗");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-8 rounded-2xl border border-line bg-surface px-5 py-12 text-center sm:px-10">
        <div aria-hidden className="flex h-12 items-center gap-1">
          {Array.from({ length: 16 }, (_, i) => (
            <span
              key={i}
              className="h-full w-1.5 origin-center animate-wave rounded-full bg-accent"
              style={{ animationDelay: `${(i % 6) * 0.1}s`, opacity: 0.45 + (i % 4) * 0.15 }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-serif text-xl font-semibold">正在整理你的會議記錄</p>
          <p className="text-sm text-muted">
            已經過 <span className="font-mono text-ink">{elapsed}</span> 秒，錄音越長需要越久，請不要關閉頁面。
          </p>
        </div>
        <ol className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
          {STAGES.map((s) => (
            <li key={s.label} className="flex flex-1 items-center gap-2 sm:flex-col sm:gap-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line-strong bg-paper text-accent">
                <s.icon />
              </span>
              <span className="text-sm text-ink-soft">{s.label}</span>
            </li>
          ))}
        </ol>
        <div aria-hidden className="relative h-1 w-full max-w-md overflow-hidden rounded-full bg-sunken">
          <span className="absolute inset-y-0 left-0 w-2/5 animate-scan rounded-full bg-accent" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files[0]);
        }}
        className={`group relative flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed px-5 py-12 text-center transition-colors sm:py-14 ${
          dragging ? "border-accent bg-accent-soft/60" : "border-line-strong bg-surface hover:border-accent/60 hover:bg-accent-soft/25"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*,video/mp4,video/webm"
          onChange={(e) => pick(e.target.files?.[0])}
          className="sr-only"
        />
        <span className="grid size-14 place-items-center rounded-2xl bg-accent text-2xl text-accent-ink shadow-[0_10px_25px_-10px_var(--accent)] transition-transform group-hover:-translate-y-0.5">
          <UploadIcon />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold">
            <span className="hidden sm:inline">把錄音檔拖到這裡，或</span>
            <span className="text-accent underline decoration-accent/30 underline-offset-4">選擇檔案</span>
          </p>
          <p className="text-sm text-muted">mp3、m4a、wav、webm、mp4 等格式，單檔最大 25MB</p>
        </div>
      </label>

      {file && (
        <div className="flex animate-rise items-center gap-3 rounded-xl border border-line bg-surface p-3 sm:p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent-soft text-lg text-accent">
            <WaveIcon />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{file.name}</p>
            <p className="text-xs text-muted">{formatSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={clear}
            aria-label="移除檔案"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-ink"
          >
            <XIcon />
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          <AlertIcon className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!file}
        className="group inline-flex h-12 items-center justify-center gap-2 self-stretch rounded-full bg-accent px-8 font-medium text-accent-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-muted sm:self-end"
      >
        產生會議記錄
        <ArrowRightIcon className="transition-transform group-enabled:group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}
