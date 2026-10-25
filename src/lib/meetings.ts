import { isValidObjectId, type HydratedDocument } from "mongoose";
import { MeetingModel, type Meeting } from "@/models/Meeting";
import type { MeetingDetail, MeetingListItem } from "@/types/meeting";

// 只會找到屬於該使用者的會議；id 格式錯或不是本人的都回 null
export async function findOwnMeeting(id: string, userId: string) {
  if (!isValidObjectId(id)) return null;
  return MeetingModel.findOne({ _id: id, userId });
}

export function toListItem(doc: HydratedDocument<Meeting>): MeetingListItem {
  const summary = doc.ai?.summary ?? null;
  return {
    id: doc._id.toString(),
    title: doc.title,
    createdAt: doc.createdAt.toISOString(),
    status: doc.status,
    summaryPreview: summary && summary.length > 80 ? `${summary.slice(0, 80)}…` : summary,
    hasAudio: Boolean(doc.audio),
  };
}

export function toDetail(doc: HydratedDocument<Meeting>): MeetingDetail {
  const id = doc._id.toString();
  return {
    id,
    title: doc.title,
    createdAt: doc.createdAt.toISOString(),
    status: doc.status,
    errorMessage: doc.errorMessage ?? null,
    transcript: doc.transcript,
    transcriptModel: doc.transcriptModel ?? null,
    summary: doc.ai
      ? {
          summary: doc.ai.summary ?? "",
          keyPoints: doc.ai.keyPoints,
          actionItems: doc.ai.actionItems.map((item) => ({
            task: item.task,
            owner: item.owner ?? null,
            dueDate: item.dueDate ?? null,
          })),
        }
      : null,
    summaryModel: doc.ai?.model ?? null,
    audioUrl: doc.audio ? `/api/meetings/${id}/audio` : null,
    audioFileName: doc.audio?.fileName ?? null,
  };
}
