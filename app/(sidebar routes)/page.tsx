import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  getTasksServer,
  getBabyToday,
  getMomTip,
  checkServerSession,
} from "@/lib/api/serverApi";
import TasksReminderCard from "@/components/TasksReminderCard/TasksReminderCard";
import BabyTodayCard from "@/components/BabyTodayCard/BabyTodayCard";
import MomTipCard from "@/components/MomTipCard/MomTipCard";
import css from "./page.module.css";

export default async function DashboardPage() {
  const queryClient = new QueryClient();
  const momTip = await getMomTip(1);
  const tasks = await getTasksServer();
  const isAuth = await checkServerSession();
  const babyToday = await getBabyToday();

  await queryClient.prefetchQuery({
    queryKey: ["tasks"],
    queryFn: getTasksServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={css.pageContainer}>
        <div className={css.cardsContainerLeft}>
          <BabyTodayCard babyToday={babyToday} />
          <MomTipCard momTip={momTip} />
        </div>
        <div className={css.cardsContainer}>
          <TasksReminderCard tasks={tasks} isAuth={isAuth} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
