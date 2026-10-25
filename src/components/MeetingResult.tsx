"use client";

import { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import { AlertIcon, CheckIcon, ChevronDownIcon, ClockIcon, CopyIcon, DocIcon, ListIcon, SparkIcon, UserIcon } from "./icons";
import type { MeetingDetail } from "@/types/meeting";

// 把整理結果轉成純文字，方便貼到群組或文件
function toPlainText(meeting: MeetingDetail) {
  const { summary } = meeting;
  const lines = [`# ${meeting.title}`, ""];
  if (summary) {
    lines.push("【摘要】", summary.summary, "", "【重點】", ...summary.keyPoints.map((p) => `- ${p}`), "");
    lines.push(
      "【待辦事項】",
      ...summary.actionItems.map(
        (a) => `- ${a.task}（負責人：${a.owner ?? "未指定"}；期限：${a.dueDate ?? "未指定"}）`,
      ),
      "",
    );
  }
  lines.push("【逐字稿】", meeting.transcript);
  return lines.join("\n");
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3.5 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
    >
      {copied ? <CheckIcon className="text-good" /> : <CopyIcon />}
      {copied ? "已複製" : label}
    </button>
  );
}

function SectionTitle({ icon: Icon, children, aside }: { icon: typeof DocIcon; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2.5 font-serif text-lg font-black">
        <span className="grid size-8 place-items-center rounded-lg bg-accent-soft text-accent">
          <Icon />
        </span>
        {children}
      </h2>
      {aside}
    </div>
  );
}

export default function MeetingResult({ meeting }: { meeting: MeetingDetail }) {
  const { summary } = meeting;
  const [transcriptOpen, setTranscriptOpen] = useState(!summary);

  return (
    <div className="flex flex-col gap-6">
      {/* 標題區 */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon />
              {new Date(meeting.createdAt).toLocaleString("zh-TW", { dateStyle: "medium", timeStyle: "short" })}
            </span>
            {meeting.status === "completed" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-good-soft px-2 py-0.5 text-xs font-medium text-good">
                <CheckIcon />
                已整理
              </span>
            )}
          </p>
          <h1 className="break-words font-serif text-3xl font-black leading-tight sm:text-4xl">{meeting.title}</h1>
        </div>
        <CopyButton text={toPlainText(meeting)} label="複製整份記錄" />
      </header>

      {meeting.audioUrl && <AudioPlayer src={meeting.audioUrl} fileName={meeting.audioFileName} />}

      {meeting.status === "failed" && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-warn-soft px-4 py-3 text-sm text-warn">
          <AlertIcon className="mt-0.5 shrink-0" />
          逐字稿已完成，但 AI 整理失敗：{meeting.errorMessage ?? "未知錯誤"}
        </p>
      )}

      {summary && (
        <>
          {/* 摘要：像一張便條紙，左側朱紅線 */}
          <section className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-accent" />
            <SectionTitle icon={SparkIcon}>摘要</SectionTitle>
            <p className="mt-4 whitespace-pre-wrap break-words text-[1.05rem] leading-8 text-ink-soft">{summary.summary}</p>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
              <SectionTitle
                icon={ListIcon}
                aside={<span className="font-mono text-xs text-muted">{summary.keyPoints.length} 項</span>}
              >
                重點
              </SectionTitle>
              {summary.keyPoints.length > 0 ? (
                <ol className="flex flex-col gap-3">
                  {summary.keyPoints.map((point, i) => (
                    <li key={i} className="flex gap-3 leading-7">
                      <span className="mt-0.5 font-mono text-sm font-medium text-accent">{String(i + 1).padStart(2, "0")}</span>
                      <span className="min-w-0 break-words text-ink-soft">{point}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted">沒有整理出重點。</p>
              )}
            </section>

            <section className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
              <SectionTitle
                icon={CheckIcon}
                aside={<span className="font-mono text-xs text-muted">{summary.actionItems.length} 項</span>}
              >
                待辦事項
              </SectionTitle>
              {summary.actionItems.length > 0 ? (
                <ul className="flex flex-col gap-2.5">
                  {summary.actionItems.map((item, i) => (
                    <li key={i} className="flex gap-3 rounded-xl border border-line bg-paper p-3.5">
                      <span aria-hidden className="mt-1 size-4 shrink-0 rounded border-[1.5px] border-line-strong" />
                      <div className="flex min-w-0 flex-col gap-2">
                        <span className="break-words leading-6">{item.task}</span>
                        <span className="flex flex-wrap gap-1.5 text-xs">
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 font-medium text-accent">
                            <UserIcon />
                            {item.owner ?? "未指定"}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-sunken px-2 py-0.5 text-ink-soft">
                            <ClockIcon />
                            {item.dueDate ?? "未指定期限"}
                          </span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">這場會議沒有待辦事項。</p>
              )}
            </section>
          </div>
        </>
      )}

      {/* 逐字稿：預設收合，避免長篇蓋過重點 */}
      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between gap-3 p-4 sm:p-6">
          <button
            type="button"
            onClick={() => setTranscriptOpen((v) => !v)}
            aria-expanded={transcriptOpen}
            className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
              <DocIcon />
            </span>
            <span className="font-serif text-lg font-black">逐字稿</span>
            <span className="hidden font-mono text-xs text-muted sm:inline">{meeting.transcript.length.toLocaleString()} 字</span>
            <ChevronDownIcon className={`ml-auto shrink-0 text-muted transition-transform ${transcriptOpen ? "rotate-180" : ""}`} />
          </button>
          {transcriptOpen && <CopyButton text={meeting.transcript} label="複製" />}
        </div>
        {transcriptOpen && (
          <div className="border-t border-line bg-paper/50 px-4 py-5 sm:px-6">
            <p className="max-h-[32rem] overflow-y-auto whitespace-pre-wrap break-words leading-8 text-ink-soft">
              {meeting.transcript}
            </p>
          </div>
        )}
      </section>

      {(meeting.transcriptModel || meeting.summaryModel) && (
        <p className="text-center text-xs text-muted/80">
          {meeting.transcriptModel && `語音辨識 ${meeting.transcriptModel}`}
          {meeting.transcriptModel && meeting.summaryModel && " · "}
          {meeting.summaryModel && `AI 整理 ${meeting.summaryModel}`}
        </p>
      )}
    </div>
  );
}
