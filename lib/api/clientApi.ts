import { User } from "@/types/user";
import { nextServer } from "./api";
import { TasksResponse, Task } from "@/types/tasks";
import { BabyToday, WeekGreetingResponse } from "@/types/baby";
import { ComfortTip, FeelingsResponse } from "@/types/tip";

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

export const getTasks = async (): Promise<Task[]> => {
  const response = await nextServer.get<TasksResponse>("/tasks");

  return response.data.tasks ?? [];
};

export const updateTaskStatus = async (taskId: string, isDone: boolean) => {
  return nextServer.patch(`/tasks/status/${taskId}`, { isDone });
};

export const getBabyToday = async (): Promise<BabyToday> => {
  const { data } = await nextServer.get<WeekGreetingResponse>(
    "/week/greeting/public"
  );
  return data.babyToday;
};

export const getComfortTips = async (): Promise<ComfortTip[]> => {
  const { data } = await nextServer.get<FeelingsResponse>(
    "/weeks/{weekNumber}/mom"
  );
  return data.comfortTips ?? [];
};
