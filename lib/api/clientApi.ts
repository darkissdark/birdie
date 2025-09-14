import { User } from "@/types/user";
import { CreateTask, Task } from "@/types/task";
import { nextServer } from "./api";
import { DiaryEntry, SortOrder } from "@/types/dairy";

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
  diaryNotes: DiaryEntry[];
  totalCount: number;
  totalPages: number;
  page: number;
}

export interface DiaryListParams {
  page: number;
  limit?: number;
  sortOrder: SortOrder;
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

export interface UserStats {
  currentWeek: number;
  daysUntilMeeting: number;
}

export const getUserStats = async (): Promise<UserStats> => {
  const { data } = await nextServer.get<UserStats>("/user/stats");
  return data;
};
