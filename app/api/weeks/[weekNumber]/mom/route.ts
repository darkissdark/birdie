import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../../_utils/utils";
import { FeelingsResponse } from "@/types/tip";

type Props = {
  params: Promise<{ weekNumber: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { weekNumber } = await params;
    const cookieStore = await cookies();

    const res = await api<FeelingsResponse>(`/weeks/${weekNumber}/mom`, {
      headers: {
        Cookie: cookieStore.toString(),
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
