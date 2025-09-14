import { cookies } from "next/headers";
import { nextServer } from "./api";
import { TasksResponse, Task } from "@/types/tasks";
import { BabyToday, WeekGreetingResponse } from "@/types/baby";
import { ComfortTip, FeelingsResponse } from "@/types/tip";

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export const getTasksServer = async (): Promise<Task[]> => {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<TasksResponse>("/tasks", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data.tasks;
};

export const getBabyToday = async (): Promise<BabyToday> => {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<WeekGreetingResponse>(
    "/week/greeting/public",
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );

  return data.babyToday;
};

export const getMomTip = async (weekNumber: number): Promise<ComfortTip> => {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<FeelingsResponse>(
    `/weeks/${weekNumber}/mom`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );

  return data.comfortTips[0];
};
