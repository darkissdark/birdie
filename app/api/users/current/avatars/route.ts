import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { logErrorResponse } from "@/app/api/_utils/utils";

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const formData = await request.formData();

    const res = await api.patch("/users/current/avatars", formData, {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
