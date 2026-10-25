import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { createSession } from "@/lib/auth";
import { UserModel } from "@/models/User";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  const name = String(body?.name ?? "").trim();

  if (!EMAIL_PATTERN.test(email)) {
    return Response.json({ error: "Email 格式不正確" }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json({ error: "密碼至少要 8 個字元" }, { status: 400 });
  }

  await connectDB();
  if (await UserModel.exists({ email })) {
    return Response.json({ error: "這個 Email 已經註冊過了" }, { status: 409 });
  }

  let user;
  try {
    user = await UserModel.create({
      email,
      name: name || undefined,
      passwordHash: await bcrypt.hash(password, 10),
    });
  } catch (err) {
    // 同時送出兩次註冊時，由 unique index 擋下第二次
    if ((err as { code?: number }).code === 11000) {
      return Response.json({ error: "這個 Email 已經註冊過了" }, { status: 409 });
    }
    throw err;
  }

  // 註冊完直接登入
  await createSession({ userId: user._id.toString(), email: user.email });
  return Response.json({ user: { id: user._id, email: user.email, name: user.name } }, { status: 201 });
}
