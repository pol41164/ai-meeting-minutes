import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { createSession } from "@/lib/auth";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return Response.json({ error: "請輸入 Email 和密碼" }, { status: 400 });
  }

  await connectDB();
  const user = await UserModel.findOne({ email });
  // 不區分「帳號不存在」和「密碼錯」，避免被拿來探測哪些 Email 有註冊
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return Response.json({ error: "Email 或密碼錯誤" }, { status: 401 });
  }

  await createSession({ userId: user._id.toString(), email: user.email });
  return Response.json({ user: { id: user._id, email: user.email, name: user.name } });
}
