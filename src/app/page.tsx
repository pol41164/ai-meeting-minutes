import Link from "next/link";
import Logo from "@/components/Logo";
import {
  ArrowRightIcon,
  CheckIcon,
  DocIcon,
  ListIcon,
  LockIcon,
  SparkIcon,
  UploadIcon,
  WaveIcon,
} from "@/components/icons";

const WAVE_HEIGHTS = [40, 70, 55, 90, 65, 100, 45, 80, 60, 95, 50, 75, 85, 40, 65, 55, 90, 70, 45, 60, 80, 50, 70, 35];

const STEPS = [
  {
    icon: UploadIcon,
    title: "上傳錄音",
    body: "手機錄的、線上會議匯出的都可以。支援 mp3、m4a、wav、webm 等常見格式。",
  },
  {
    icon: DocIcon,
    title: "轉成逐字稿",
    body: "語音辨識把整場對話轉成繁體中文逐字稿，誰說了什麼都留得下來。",
  },
  {
    icon: SparkIcon,
    title: "整理成會議記錄",
    body: "AI 讀完逐字稿，整理出摘要、討論重點，以及誰在什麼時候要做什麼。",
  },
];

const AUDIENCES = [
  { tag: "PM / 團隊主管", title: "週會、站會、專案檢討", body: "會後不用再花半小時補記錄，待辦事項和負責人直接列好，貼到群組就能追。" },
  { tag: "業務 / 顧問", title: "客戶訪談與需求會議", body: "專心聽客戶說話，不用邊聽邊打字。回頭查「客戶當時怎麼講的」，逐字稿都在。" },
  { tag: "研究者 / 學生", title: "訪談、讀書會、課堂", body: "訪談錄音轉成逐字稿再整理重點，省下最花時間的謄寫工作。" },
  { tag: "新創 / 小團隊", title: "沒有專人做會議記錄", body: "人少事多，誰都不想當紀錄。交給 AI，每場會議都有一份像樣的記錄。" },
];

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* 後方錯位的紙張，營造一疊記錄的感覺 */}
      <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rotate-2 rounded-2xl border border-line bg-sunken" />

      <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-[0_30px_60px_-30px_rgb(60_40_20/0.35)]">
        {/* 錄音檔 */}
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
            <WaveIcon className="text-lg" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">第四季行銷週會.m4a</p>
            <div aria-hidden className="mt-1.5 flex h-5 items-center gap-[3px]">
              {WAVE_HEIGHTS.map((h, i) => (
                <span
                  key={i}
                  className="w-[3px] origin-center animate-wave rounded-full bg-accent/70"
                  style={{ height: `${h}%`, animationDelay: `${(i % 8) * 0.12}s` }}
                />
              ))}
            </div>
          </div>
          <span className="shrink-0 font-mono text-xs text-muted">32:15</span>
        </div>

        <div className="flex flex-col gap-5 px-5 py-5">
          <div>
            <p className="mb-1.5 text-[11px] font-bold tracking-[0.2em] text-accent">摘要</p>
            <p className="text-sm leading-6 text-ink-soft">
              會議討論第四季行銷預算分配，決定加碼社群廣告、縮減實體活動，最終版本下週五前定案。
            </p>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-bold tracking-[0.2em] text-accent">重點</p>
            <ul className="flex flex-col gap-1.5 text-sm text-ink-soft">
              {["社群廣告預算提高 20%", "年底實體展覽改為線上直播", "KPI 改以名單轉換率衡量"].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink-soft" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-bold tracking-[0.2em] text-accent">待辦</p>
            <ul className="flex flex-col gap-2">
              {[
                { task: "提出行銷預算最終版本", owner: "小王", due: "下週五" },
                { task: "聯繫直播平台報價", owner: "Amy", due: "本週三" },
              ].map((a) => (
                <li key={a.task} className="flex items-center gap-3 rounded-lg border border-line bg-paper px-3 py-2">
                  <span className="grid size-4 shrink-0 place-items-center rounded border border-line-strong" />
                  <span className="min-w-0 flex-1 truncate text-sm">{a.task}</span>
                  <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                    {a.owner} · {a.due}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 浮動標籤 */}
      <div className="absolute -top-4 right-4 flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 py-1.5 text-xs font-medium shadow-sm sm:-right-4">
        <span className="size-1.5 rounded-full bg-good" />
        AI 整理完成
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* 導覽列 */}
      <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-1 text-sm sm:gap-2">
            <a href="#how" className="hidden rounded-full px-3 py-2 text-muted hover:text-ink md:block">怎麼運作</a>
            <a href="#who" className="hidden rounded-full px-3 py-2 text-muted hover:text-ink md:block">適合誰</a>
            <Link href="/login" className="rounded-full px-3 py-2 text-ink-soft hover:text-ink">登入</Link>
            <Link
              href="/register"
              className="rounded-full bg-ink px-4 py-2 font-medium text-paper transition-colors hover:bg-ink-soft"
            >
              免費註冊
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="paper-grid pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-28">
            <div className="flex animate-rise flex-col items-start gap-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-3 py-1 text-xs font-medium text-ink-soft">
                <SparkIcon className="text-accent" />
                錄音 → 逐字稿 → 會議記錄，一次完成
              </span>
              <h1 className="font-serif text-[2.6rem] font-black leading-[1.15] tracking-tight sm:text-6xl lg:text-[4.25rem]">
                開完會，
                <br />
                記錄<span className="relative whitespace-nowrap text-accent">
                  已經寫好
                  <svg aria-hidden viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-3 w-full text-accent/40">
                    <path d="M2 8c40-6 120-7 196-2" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
                了。
              </h1>
              <p className="max-w-xl text-base leading-8 text-muted sm:text-lg">
                上傳會議錄音，AI 自動轉成逐字稿，再整理出摘要、討論重點和待辦事項。
                你只要專心開會，記錄交給我們。
              </p>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/register"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 font-medium text-accent-ink shadow-[0_10px_30px_-10px_var(--accent)] transition-colors hover:bg-accent-hover"
                >
                  免費註冊，開始使用
                  <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-line-strong bg-surface px-7 font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  我已經有帳號
                </Link>
              </div>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                {["繁體中文逐字稿", "自動列出待辦與負責人", "紀錄只有你看得到"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <CheckIcon className="text-good" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="animate-rise [animation-delay:150ms]">
              <HeroPreview />
            </div>
          </div>
        </section>

        {/* 在做什麼 */}
        <section id="how" className="scroll-mt-20 border-y border-line bg-surface">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <div className="max-w-2xl">
              <p className="text-sm font-bold tracking-[0.2em] text-accent">HOW IT WORKS</p>
              <h2 className="mt-3 font-serif text-3xl font-black leading-tight sm:text-4xl">
                從一段錄音，到一份能直接用的會議記錄
              </h2>
              <p className="mt-4 leading-8 text-muted">
                不用學新工具、不用整理格式。上傳之後等一下，結果就出來了。
              </p>
            </div>

            <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex flex-col gap-4 bg-surface p-7 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-xl text-accent">
                      <step.icon />
                    </span>
                    <span className="font-serif text-5xl font-black text-line-strong">0{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="leading-7 text-muted">{step.body}</p>
                </li>
              ))}
            </ol>

            {/* 產出內容 */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: DocIcon, title: "完整逐字稿", body: "整場對話的文字版本" },
                { icon: SparkIcon, title: "會議摘要", body: "一段話看懂這場會" },
                { icon: ListIcon, title: "討論重點", body: "決議與關鍵結論" },
                { icon: CheckIcon, title: "待辦事項", body: "任務、負責人、期限" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-4 rounded-xl border border-line bg-paper px-5 py-4">
                  <item.icon className="shrink-0 text-xl text-accent" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 給誰用 */}
        <section id="who" className="scroll-mt-20">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-bold tracking-[0.2em] text-accent">WHO IT&apos;S FOR</p>
                <h2 className="mt-3 font-serif text-3xl font-black leading-tight sm:text-4xl">
                  每個要開會、
                  <br className="sm:hidden" />
                  又不想寫記錄的人
                </h2>
              </div>
              <p className="max-w-sm leading-7 text-muted">只要有錄音，就能變成記錄。下面是最常見的用法。</p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {AUDIENCES.map((a) => (
                <article
                  key={a.title}
                  className="group flex flex-col gap-3 rounded-2xl border border-line bg-surface p-7 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_20px_40px_-25px_rgb(60_40_20/0.35)]"
                >
                  <span className="self-start rounded-full bg-sunken px-3 py-1 text-xs font-medium text-ink-soft">{a.tag}</span>
                  <h3 className="font-serif text-xl font-semibold">{a.title}</h3>
                  <p className="leading-7 text-muted">{a.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 怎麼開始 */}
        <section className="border-t border-line bg-sunken/60">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
            <div>
              <p className="text-sm font-bold tracking-[0.2em] text-accent">GET STARTED</p>
              <h2 className="mt-3 font-serif text-3xl font-black leading-tight sm:text-4xl">三分鐘開始使用</h2>
              <p className="mt-4 max-w-md leading-8 text-muted">
                註冊只需要 Email 和密碼。每一筆會議記錄都綁定在你的帳號下，登入後只看得到自己上傳的內容。
              </p>
              <div className="mt-8 flex items-start gap-3 rounded-xl border border-line bg-surface p-5">
                <LockIcon className="mt-0.5 shrink-0 text-xl text-accent" />
                <p className="text-sm leading-6 text-muted">
                  錄音檔不會直接公開連結，必須登入你的帳號，透過系統驗證後才能播放或下載。
                </p>
              </div>
            </div>

            <ol className="flex flex-col gap-4">
              {[
                { title: "建立帳號", body: "用 Email 註冊，馬上就能用。" },
                { title: "上傳會議錄音", body: "選擇或拖曳音檔，單檔最大 25MB。" },
                { title: "拿到會議記錄", body: "逐字稿、摘要、重點、待辦一次到位，隨時回來查。" },
              ].map((s, i) => (
                <li key={s.title} className="flex gap-5 rounded-2xl border border-line bg-surface p-6">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-mono text-sm font-medium text-paper">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold">{s.title}</h3>
                    <p className="mt-1 leading-7 text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 結尾 CTA */}
        <section className="px-4 py-20 sm:px-6 lg:py-24">
          <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center sm:px-12 sm:py-20">
            <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-accent/25 blur-3xl" />
            <div aria-hidden className="absolute -bottom-20 -left-10 size-64 rounded-full bg-accent/15 blur-3xl" />
            <div className="relative flex flex-col items-center gap-6">
              <h2 className="font-serif text-3xl font-black leading-tight text-paper sm:text-5xl">
                下一場會議，
                <br className="sm:hidden" />
                不用再自己記了
              </h2>
              <p className="max-w-lg leading-8 text-paper/70">註冊帳號，上傳第一段錄音，看看 AI 幫你整理出什麼。</p>
              <Link
                href="/register"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-8 font-medium text-accent-ink transition-colors hover:bg-accent-hover"
              >
                免費註冊
                <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
          <Logo />
          <p>© 2026 AI 會議記錄</p>
        </div>
      </footer>
    </div>
  );
}
