import { cookies } from "next/headers";
import { nextServer } from "./api";
import {
  DiaryListResponse,
  DiaryListParams,
  EmotionsResponse,
  EmotionsParams,
} from "./clientApi";
import { WeeksGeneralInfo } from "@/types/weeks";

export const getDiaryListServer = async (
  params: DiaryListParams
): Promise<DiaryListResponse> => {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<DiaryListResponse>("/diary", {
    headers: {
      Cookie: cookieStore.toString(),
    },
    params,
  });
  return data;
};

export const getEmotionsServer = async (
  params: EmotionsParams = {}
): Promise<EmotionsResponse> => {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<EmotionsResponse>("/emotions", {
    headers: {
      Cookie: cookieStore.toString(),
    },
    params,
  });
  return data;
};
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

export async function fetchGreeting(): Promise<WeeksGeneralInfo> {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<WeeksGeneralInfo>("/weeks/greeting", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}

export const getTasksServer = async (): Promise<Task[]> => {
  try {
    const cookieStore = await cookies();

    const { data } = await nextServer.get<TasksResponse>("/tasks", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const tasks = data?.tasks;
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error("Error fetching tasks server:", error);
    return [];
  }
};

export const getBabyToday = async (): Promise<BabyToday> => {
  const cookieStore = await cookies();
  const isAuth = await checkServerSession();

  const endpoint = isAuth ? "/weeks/greeting" : "/weeks/greeting/public";

  const { data } = await nextServer.get<WeekGreetingResponse>(endpoint, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

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
