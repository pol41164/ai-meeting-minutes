import { getCurrentUser, unauthorized } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { toListItem } from "@/lib/meetings";
import { MeetingModel } from "@/models/Meeting";

// 目前登入者的歷史會議列表（不含逐字稿全文）
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  await connectDB();
  const meetings = await MeetingModel.find({ userId: user.userId })
    .select("-transcript -transcriptSegments")
    .sort({ createdAt: -1 })
    .limit(100);

  return Response.json({ meetings: meetings.map(toListItem) });
}
