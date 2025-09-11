import { cookies } from "next/headers";
import { nextServer } from "./api";
import { DiaryListResponse } from "./clientApi";

export const getDiaryListServer = async (): Promise<DiaryListResponse> => {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<DiaryListResponse>("/diary", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
