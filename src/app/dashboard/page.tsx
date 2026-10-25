import AppHeader from "@/components/AppHeader";
import MeetingHistory from "@/components/MeetingHistory";
import TranscribeForm from "@/components/TranscribeForm";

export default function DashboardPage() {
  return (
    <>
      <AppHeader />
      <main className="relative flex-1">
        <div aria-hidden className="paper-grid pointer-events-none absolute inset-x-0 top-0 h-80 opacity-50" />
        <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-14 px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold tracking-[0.2em] text-accent">NEW MEETING</p>
              <h1 className="font-serif text-3xl font-black leading-tight sm:text-4xl">上傳會議錄音</h1>
              <p className="leading-7 text-muted">自動轉成逐字稿，並整理出摘要、重點與待辦事項。</p>
            </div>
            <TranscribeForm />
          </section>

          <MeetingHistory />
        </div>
      </main>
    </>
  );
}
