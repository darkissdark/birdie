export interface DiaryEntry {
  _id: string;
  title: string;
  description: string;
  emotions: { _id: string; title: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiEmotion {
  _id: string;
  name?: string;
  title?: string;
}

export interface DiaryFormValues {
  title: string;
  description: string;
  emotions: string[];
}

export interface DiarySubmitValues {
  title: string;
  description: string;
  emotions: string[];
}
