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
import GreetingBlock from "@/components/GreetingBlock/GreetingBlock";
import StatusBlock from "@/components/StatusBlock/StatusBlock";
import FeelingCheckCard from "@/components/FeelingCheckCard/FeelingCheckCard";
import css from "./page.module.css";

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  const authResponse = await checkServerSession();
  const isAuth = authResponse?.data?.success || false;

  const prefetchPromises = [
    queryClient.prefetchQuery({
      queryKey: ["momTip", 1],
      queryFn: () => getMomTip(1),
    }),
    queryClient.prefetchQuery({
      queryKey: ["babyToday"],
      queryFn: getBabyToday,
    }),
  ];

  if (isAuth) {
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: ["tasks"],
        queryFn: getTasksServer,
      })
    );
  }

  await Promise.all(prefetchPromises);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={css.pageContainer}>
        <div className={css.cardsContainerLeft}>
           <GreetingBlock />
        <StatusBlock />
          <BabyTodayCard />
          <MomTipCard />
        </div>
        <div className={css.cardsContainer}>
          <TasksReminderCard />
          <FeelingCheckCard />
        </div>
      </div>
    </HydrationBoundary>
  );
}
