import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTasksServer, getBabyToday, getMomTip } from "@/lib/api/serverApi";
import TasksReminderCard from "@/components/TasksReminderCard/TasksReminderCard";
import BabyTodayCard from "@/components/BabyTodayCard/BabyTodayCard";
import MomTipCard from "@/components/MomTipCard/MomTipCard";
import css from "./page.module.css";

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["tasks"],
      queryFn: getTasksServer,
    }),
    queryClient.prefetchQuery({
      queryKey: ["momTip", 1],
      queryFn: () => getMomTip(1),
    }),
    queryClient.prefetchQuery({
      queryKey: ["babyToday"],
      queryFn: getBabyToday,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={css.pageContainer}>
        <div className={css.cardsContainerLeft}>
          <BabyTodayCard />
          <MomTipCard />
        </div>
        <div className={css.cardsContainer}>
          <TasksReminderCard />
        </div>
      </div>
    </HydrationBoundary>
  );
}
