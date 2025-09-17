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
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Лелека - Мій день",
  description:
    "Отримуй щоденні поради, відстежуй розвиток малюка та плануй свій день разом з нами.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Лелека - Мій день",
    description:
      "Отримуй щоденні поради, відстежуй розвиток малюка та плануй свій день разом з нами.",
    url: "https://birdie-kohl.vercel.app/",
    images: [
      {
        url: "https://st2.depositphotos.com/3827765/5416/v/600/depositphotos_54165269-stock-illustration-stork-carrying-a-baby.jpg",
        width: 600,
        height: 446,
        alt: "Лелека - Твій помічник під час вагітності",
      },
    ],
  },
};

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
        <div>
          <GreetingBlock />
        </div>
        <div className={css.cardsMainContainer}>
          <div className={css.cardsContainerLeft}>
            <StatusBlock />
            <BabyTodayCard />
            <MomTipCard />
          </div>
          <div className={css.cardsContainerRight}>
            <TasksReminderCard />
            <FeelingCheckCard />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
