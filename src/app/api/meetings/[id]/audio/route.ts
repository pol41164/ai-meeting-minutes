import { get } from "@vercel/blob";
import { getCurrentUser, unauthorized } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { findOwnMeeting } from "@/lib/meetings";
import { BLOB_ACCESS } from "@/lib/blob";

// 檢查擁有者後才從 Blob 串流錄音檔，前端拿不到 Blob 原始網址
export async function GET(request: Request, ctx: RouteContext<"/api/meetings/[id]/audio">) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const { id } = await ctx.params;
  await connectDB();
  const meeting = await findOwnMeeting(id, user.userId);
  if (!meeting?.audio) {
    return Response.json({ error: "找不到錄音檔" }, { status: 404 });
  }

  // 轉送 Range，讓播放器可以拖曳進度
  const range = request.headers.get("range");
  const result = await get(meeting.audio.pathname, {
    access: BLOB_ACCESS,
    headers: range ? { range } : undefined,
  });
  if (!result?.stream) {
    return Response.json({ error: "找不到錄音檔" }, { status: 404 });
  }

  const headers = new Headers({
    "Content-Type": meeting.audio.contentType || result.headers.get("content-type") || "application/octet-stream",
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, no-store",
  });
  for (const name of ["content-length", "content-range"]) {
    const value = result.headers.get(name);
    if (value) headers.set(name, value);
  }

  return new Response(result.stream, {
    status: result.headers.has("content-range") ? 206 : 200,
    headers,
  });
}
