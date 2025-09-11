export interface DiaryEntry {
  _id?: string;
  title: string;
  description: string;
  emotions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiEmotion {
  _id: string;
  name?: string;
  title?: string;
}
