import { cookies } from "next/headers";
import { nextServer } from "./api";
import { DiaryListResponse, DiaryListParams } from "./clientApi";

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

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};
