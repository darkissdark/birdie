import { User } from "@/types/user";
import { CreateTask } from "@/types/task";
import { nextServer } from "./api";

import { TasksResponse, Task } from "@/types/tasks";
import { BabyToday, WeekGreetingResponse } from "@/types/baby";
import { ComfortTip, FeelingsResponse } from "@/types/tip";
import { AboutBaby, AboutMom } from "@/types/weeks";
import { DiaryEntryData, SortOrder } from "@/types/diary";

export type { AboutBaby, AboutMom };

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
  try {
    const { data } = await nextServer.get<SessionStatus>("/auth/session");
    return data.success;
  } catch (error) {
    console.error("Session check failed:", error);
    return false;
  }
};

export const getMe = async () => {
  const { data } = await nextServer.get<User>("/users/current");
  return data;
};

export interface DiaryListResponse {
  diaryNotes: DiaryEntryData[];
  totalCount: number;
  totalPages: number;
  page: number;
}

export interface DiaryListParams {
  page: number;
  limit?: number;
  sortOrder?: SortOrder;
}

export const getDiaryList = async (
  params: DiaryListParams
): Promise<DiaryListResponse> => {
  const { data } = await nextServer.get<DiaryListResponse>("/diary", {
    params,
  });
  return data;
};

export const createTask = async (newTask: CreateTask): Promise<Task> => {
  const { data } = await nextServer.post<Task>("/tasks", newTask);
  return data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file); // "avatar" — ключ, який сервер очікує

  const res = await nextServer.patch<User>("/users/current/avatars", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export interface UserStats {
  currentWeek: number;
  daysUntilMeeting: number;
}

export const getUserStats = async (): Promise<UserStats> => {
  const { data } = await nextServer.get<UserStats>("/user/stats");
  return data;
};

export interface Emotion {
  _id: string;
  title: string;
}

export interface EmotionsResponse {
  emotions: Emotion[];
  totalCount: number;
  totalPages: number;
  page: number;
}

export interface EmotionsParams {
  page?: number;
  limit?: number;
}

export const getEmotions = async (
  params: EmotionsParams = {}
): Promise<EmotionsResponse> => {
  const { data } = await nextServer.get<EmotionsResponse>("/emotions", {
    params,
  });
  return data;
};

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await nextServer.get<TasksResponse>("/tasks");
    const tasks = response.data?.tasks;
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const updateTaskStatus = async (taskId: string, isDone: boolean) => {
  return nextServer.patch(`/tasks/status/${taskId}`, { isDone });
};

export const getBabyToday = async (): Promise<BabyToday> => {
  const isAuth = await checkSession();

  const endpoint = isAuth ? "/weeks/greeting" : "/weeks/greeting/public";
  const { data } = await nextServer.get<WeekGreetingResponse>(endpoint);
  return data.babyToday;
};

export async function fetchBaby(weekNumber: number): Promise<AboutBaby> {
  const { data } = await nextServer.get<AboutBaby>(`/weeks/${weekNumber}/baby`);
  return data;
}

export async function fetchMom(weekNumber: number): Promise<AboutMom> {
  const { data } = await nextServer.get<AboutMom>(`/weeks/${weekNumber}/mom`);
  return data;
}

export const getMomTip = async (weekNumber: number): Promise<ComfortTip> => {
  const { data } = await nextServer.get<FeelingsResponse>(
    `/weeks/${weekNumber}/mom`
  );
  return data.comfortTips[0];
};

export const getComfortTips = async (
  weekNumber: number
): Promise<ComfortTip[]> => {
  const { data } = await nextServer.get<FeelingsResponse>(
    `/weeks/${weekNumber}/mom`
  );
  return data.comfortTips ?? [];
};
