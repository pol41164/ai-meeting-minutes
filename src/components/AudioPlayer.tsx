"use client";

import { useRef, useState } from "react";
import { DownloadIcon, PauseIcon, PlayIcon } from "./icons";

function formatTime(sec: number) {
  if (!Number.isFinite(sec)) return "--:--";
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

export default function AudioPlayer({ src, fileName }: { src: string; fileName: string | null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(NaN);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  }

  const progress = Number.isFinite(duration) && duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 sm:gap-4 sm:p-4">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "暫停" : "播放"}
        className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-xl text-accent-ink shadow-[0_8px_20px_-8px_var(--accent)] transition-colors hover:bg-accent-hover"
      >
        {playing ? <PauseIcon /> : <PlayIcon className="translate-x-px" />}
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="truncate text-sm font-medium">{fileName ?? "會議錄音"}</p>
        <div className="flex items-center gap-3">
          <div className="relative h-1.5 flex-1 rounded-full bg-sunken">
            <div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${progress}%` }} />
            <input
              type="range"
              min={0}
              max={Number.isFinite(duration) ? duration : 0}
              step={0.1}
              value={current}
              onChange={(e) => {
                const t = Number(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = t;
                setCurrent(t);
              }}
              aria-label="播放進度"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
          <span className="shrink-0 font-mono text-xs text-muted">
            {formatTime(current)}
            <span className="hidden sm:inline"> / {formatTime(duration)}</span>
          </span>
        </div>
      </div>

      <a
        href={src}
        download={fileName ?? undefined}
        aria-label="下載錄音檔"
        className="grid size-10 shrink-0 place-items-center rounded-full text-lg text-muted transition-colors hover:bg-sunken hover:text-ink"
      >
        <DownloadIcon />
      </a>
    </div>
  );
}
