import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

// 逐字稿分段（有講者、時間軸時使用；只有純文字時可留空）
const TranscriptSegmentSchema = new Schema(
  {
    speaker: { type: String, trim: true },
    startTime: { type: Number }, // 秒
    endTime: { type: Number }, // 秒
    text: { type: String, required: true },
  },
  { _id: false },
);

const ParticipantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
  },
  { _id: false },
);

const ActionItemSchema = new Schema({
  task: { type: String, required: true },
  owner: { type: String, trim: true },
  dueDate: { type: String }, // 照逐字稿原文，例如「下週五」
  done: { type: Boolean, default: false },
});

// AI 整理結果
const AiResultSchema = new Schema(
  {
    summary: { type: String },
    keyPoints: { type: [String], default: [] },
    decisions: { type: [String], default: [] },
    actionItems: { type: [ActionItemSchema], default: [] },
    tags: { type: [String], default: [] },
    model: { type: String }, // 使用的 AI 模型
    generatedAt: { type: Date },
  },
  { _id: false },
);

// 錄音檔（存在 Vercel Blob）；url 只在伺服器端使用，不直接給前端
const AudioSchema = new Schema(
  {
    url: { type: String, required: true },
    pathname: { type: String, required: true },
    fileName: { type: String },
    contentType: { type: String },
    size: { type: Number },
  },
  { _id: false },
);

const MeetingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    meetingDate: { type: Date, default: Date.now },
    durationSeconds: { type: Number },
    participants: { type: [ParticipantSchema], default: [] },
    language: { type: String, default: "zh-TW" },
    source: {
      type: String,
      enum: ["paste", "upload", "recording"],
      default: "paste",
    },
    audio: { type: AudioSchema },

    // 完整逐字稿
    transcript: { type: String, required: true },
    transcriptModel: { type: String },
    transcriptSegments: { type: [TranscriptSegmentSchema], default: [] },

    // AI 處理狀態
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    errorMessage: { type: String },
    ai: { type: AiResultSchema },
  },
  { timestamps: true },
);

// 歷史紀錄：依使用者查、新的在前
MeetingSchema.index({ userId: 1, createdAt: -1 });

export type Meeting = InferSchemaType<typeof MeetingSchema>;

export const MeetingModel: Model<Meeting> =
  (models.Meeting as Model<Meeting>) || model<Meeting>("Meeting", MeetingSchema);
