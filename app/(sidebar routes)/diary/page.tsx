import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import css from "./DiaryPage.module.css";
import DiaryPageClient from "./DiaryPageClient";
import { getDiaryListServer } from "@/lib/api/serverApi";
import { DiaryListResponse } from "@/lib/api/clientApi";
import Greeting from "@/components/GreetingBlock/GreetingBlock";

const DiaryPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery<DiaryListResponse>({
    queryKey: ["diary", { sortOrder: "desc" }],
    queryFn: ({ pageParam = 1 }) =>
      getDiaryListServer({ page: pageParam as number, sortOrder: "desc" }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: DiaryListResponse) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  return (
    <section className={css.dairySection}>
      <div className={css.dairyContainer}>
        <Greeting />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <DiaryPageClient />
        </HydrationBoundary>
      </div>
    </section>
  );
};

export default DiaryPage;
