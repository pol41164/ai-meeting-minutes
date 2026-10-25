import { getCurrentUser, unauthorized } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { findOwnMeeting, toDetail } from "@/lib/meetings";

// 單筆會議完整內容；不是本人的一律回 404，不透露該筆是否存在
export async function GET(_request: Request, ctx: RouteContext<"/api/meetings/[id]">) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const { id } = await ctx.params;
  await connectDB();
  const meeting = await findOwnMeeting(id, user.userId);
  if (!meeting) {
    return Response.json({ error: "找不到這筆會議紀錄" }, { status: 404 });
  }

  return Response.json({ meeting: toDetail(meeting) });
}
