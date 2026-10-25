import Link from "next/link";

// 品牌字標：朱紅方印「記」+ 名稱；inverse 用在深色底
export default function Logo({ href = "/", inverse = false }: { href?: string; inverse?: boolean }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5" aria-label="AI 會議記錄 首頁">
      <span className="grid size-8 place-items-center rounded-[7px] bg-accent font-serif text-[17px] font-black text-accent-ink shadow-[inset_0_0_0_2px_rgb(255_255_255/0.18)] transition-transform group-hover:-rotate-6">
        記
      </span>
      <span className={`font-serif text-[17px] font-semibold tracking-wide ${inverse ? "text-paper" : "text-ink"}`}>
        AI 會議記錄
      </span>
    </Link>
  );
}
