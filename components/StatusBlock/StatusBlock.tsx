import React from "react";
import { getUserStats, checkServerSession } from "@/lib/api/serverApi";
import StatusBlockClient from "./StatusBlockClient";

interface UserStats {
  curWeekToPregnant: number;
  daysBeforePregnant: number;
}

const StatusBlock = async () => {
  let initialData: UserStats | null = null;

  try {
    const isAuth = await checkServerSession();

    if (isAuth?.data?.success) {
      initialData = await getUserStats();
    }
  } catch (err) {
    console.error("Помилка завантаження початкових статистик:", err);
  }

  return <StatusBlockClient initialData={initialData} />;
};

export default StatusBlock;
