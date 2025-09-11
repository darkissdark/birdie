import { User } from "@/types/user";
import { nextServer } from "./api";
import { DiaryEntry } from "@/types/dairy";

export interface Credentials {
  name?: string;
  email: string;
  password: string;
}

export async function register(credentials: Credentials) {
  const { data } = await nextServer.post<User>("/auth/register", credentials);
  return data;
}

export async function login(credentials: Credentials) {
  const { data } = await nextServer.post<User>("/auth/login", credentials);
  return data;
}
interface SessionStatus {
  success: boolean;
}
export const checkSession = async () => {
  const { data } = await nextServer.get<SessionStatus>("/auth/session");
  return data.success;
};

export const getMe = async () => {
  const { data } = await nextServer.get<User>("/users/current");
  return data;
};

export interface DiaryListResponse {
  diaryNotes: DiaryEntry[];
  totalCount: number;
  totalPages: number;
  page: number;
}

export const getDiaryList = async (): Promise<DiaryListResponse> => {
  const { data } = await nextServer.get<DiaryListResponse>("/diary");
  return data;
};
