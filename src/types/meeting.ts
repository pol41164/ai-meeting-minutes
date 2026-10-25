// 前後端共用的 API 回傳型別

export type ActionItem = {
  task: string;
  owner: string | null;
  dueDate: string | null;
};

export type MeetingSummary = {
  summary: string;
  keyPoints: string[];
  actionItems: ActionItem[];
};

export type MeetingStatus = "pending" | "processing" | "completed" | "failed";

// 歷史列表的一筆
export type MeetingListItem = {
  id: string;
  title: string;
  createdAt: string;
  status: MeetingStatus;
  summaryPreview: string | null;
  hasAudio: boolean;
};

// 單筆會議完整內容
export type MeetingDetail = {
  id: string;
  title: string;
  createdAt: string;
  status: MeetingStatus;
  errorMessage: string | null;
  transcript: string;
  transcriptModel: string | null;
  summary: MeetingSummary | null;
  summaryModel: string | null;
  // 透過我們自己的 API 播放，會檢查擁有者
  audioUrl: string | null;
  audioFileName: string | null;
};
