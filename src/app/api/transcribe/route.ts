import OpenAI from "openai";
import { put, del } from "@vercel/blob";
import { getCurrentUser, unauthorized } from "@/lib/auth";
import { BLOB_ACCESS } from "@/lib/blob";
import { connectDB } from "@/lib/mongodb";
import { toDetail } from "@/lib/meetings";
import { MeetingModel } from "@/models/Meeting";
import type { MeetingSummary } from "@/types/meeting";

// OpenAI 語音轉文字單檔上限 25MB
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["mp3", "mp4", "mpeg", "mpga", "m4a", "wav", "webm", "ogg", "flac"];
const TRANSCRIBE_MODEL = "gpt-4o-transcribe";
const SUMMARY_MODEL = "gpt-5.4-mini";

// Structured Outputs：強制模型照這個格式回 JSON
const SUMMARY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "keyPoints", "actionItems"],
  properties: {
    summary: { type: "string", description: "會議摘要，一到三段" },
    keyPoints: { type: "array", items: { type: "string" }, description: "討論重點與決議" },
    actionItems: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["task", "owner", "dueDate"],
        properties: {
          task: { type: "string", description: "要做的事" },
          owner: { type: ["string", "null"], description: "負責人，逐字稿沒提到就填 null" },
          dueDate: { type: ["string", "null"], description: "期限，照逐字稿原文，例如「下週五」；沒提到就填 null" },
        },
      },
    },
  },
} as const;

async function summarizeTranscript(openai: OpenAI, transcript: string): Promise<MeetingSummary> {
  const completion = await openai.chat.completions.create({
    model: SUMMARY_MODEL,
    messages: [
      {
        role: "system",
        content:
          "你是會議記錄助理。根據使用者提供的會議逐字稿，用繁體中文整理出摘要、重點與待辦事項。" +
          "只根據逐字稿內容整理，不要自行推測或補充沒提到的資訊；沒有待辦事項就回傳空陣列。",
      },
      { role: "user", content: transcript },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "meeting_summary", strict: true, schema: SUMMARY_SCHEMA },
    },
  });

  const content = completion.choices[0]?.message.content;
  if (!content) throw new Error("AI 沒有回傳整理結果");
  return JSON.parse(content) as MeetingSummary;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "伺服器未設定 OPENAI_API_KEY" }, { status: 500 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "請用 multipart/form-data 上傳音檔" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "請選擇音檔" }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: "音檔不能超過 25MB" }, { status: 413 });
  }
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return Response.json(
      { error: `不支援的格式，請上傳 ${ALLOWED_EXTENSIONS.join(", ")}` },
      { status: 415 },
    );
  }

  const openai = new OpenAI({ apiKey });

  let transcript: string;
  try {
    const result = await openai.audio.transcriptions.create({
      file,
      model: TRANSCRIBE_MODEL,
      response_format: "json",
      // 引導模型輸出繁體中文
      prompt: "以下是一場會議的錄音，請使用繁體中文輸出逐字稿。",
    });
    transcript = result.text;
  } catch (err) {
    console.error("[transcribe] OpenAI error:", err);
    const message = err instanceof OpenAI.APIError ? err.message : "語音轉文字失敗";
    const status = err instanceof OpenAI.APIError && err.status ? err.status : 502;
    return Response.json({ error: message }, { status });
  }

  // 整理失敗時仍保存逐字稿，避免辛苦轉好的內容白費
  let summary: MeetingSummary | null = null;
  let summaryError: string | null = null;
  try {
    summary = await summarizeTranscript(openai, transcript);
  } catch (err) {
    console.error("[transcribe] summarize error:", err);
    summaryError = err instanceof Error ? err.message : "AI 整理失敗";
  }

  // 錄音檔存到 Vercel Blob，路徑依使用者分資料夾
  let blob;
  try {
    blob = await put(`meetings/${user.userId}/${file.name}`, file, {
      access: BLOB_ACCESS,
      addRandomSuffix: true,
      contentType: file.type || undefined,
    });
  } catch (err) {
    console.error("[transcribe] blob upload error:", err);
    return Response.json(
      { error: "錄音檔儲存失敗", transcript, summary },
      { status: 502 },
    );
  }

  try {
    await connectDB();
    const meeting = await MeetingModel.create({
      userId: user.userId,
      title: file.name.replace(/\.[^.]+$/, ""),
      source: "upload",
      audio: {
        url: blob.url,
        pathname: blob.pathname,
        fileName: file.name,
        contentType: file.type || undefined,
        size: file.size,
      },
      transcript,
      transcriptModel: TRANSCRIBE_MODEL,
      status: summary ? "completed" : "failed",
      errorMessage: summaryError ?? undefined,
      ai: summary
        ? { ...summary, model: SUMMARY_MODEL, generatedAt: new Date() }
        : undefined,
    });

    return Response.json({ meeting: toDetail(meeting) }, { status: 201 });
  } catch (err) {
    console.error("[transcribe] save meeting error:", err);
    // 資料庫沒存成功，就把剛上傳的錄音檔刪掉，避免留下沒人認領的檔案
    await del(blob.url).catch(() => {});
    return Response.json(
      { error: "會議紀錄儲存失敗", transcript, summary },
      { status: 500 },
    );
  }
}
