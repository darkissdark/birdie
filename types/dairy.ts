export interface Emotion {
  _id: string;
  title: string;
}

export interface DiaryEntry {
  _id: string;
  title: string;
  date: string;
  description: string;
  emotions: Emotion[];
}

export type SortOrder = "asc" | "desc";
