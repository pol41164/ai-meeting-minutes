import Link from "next/link";
import { Suspense } from "react";
import AppHeader from "@/components/AppHeader";
import MeetingView, { MeetingSkeleton } from "@/components/MeetingView";
import { ArrowLeftIcon } from "@/components/icons";

export default function MeetingPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 self-start rounded-full py-1 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeftIcon />
            我的會議
          </Link>
          {/* useParams 讀網址參數，Cache Components 模式下要包在 Suspense 裡 */}
          <Suspense fallback={<MeetingSkeleton />}>
            <MeetingView />
          </Suspense>
        </div>
      </main>
    </>
  );
}
