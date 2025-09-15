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
