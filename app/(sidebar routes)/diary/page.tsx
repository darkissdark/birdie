import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import css from "./DiaryPage.module.css";
import DiaryPageClient from "./DiaryPageClient";
import { getDiaryListServer, getEmotionsServer } from "@/lib/api/serverApi";

const DiaryPage = async () => {
  const queryClient = new QueryClient();
  const params: { page: number } = {
    page: 1,
  };
  await queryClient.prefetchQuery({
    queryKey: ["diary"],
    queryFn: () => getDiaryListServer(params),
  });

  await queryClient.prefetchQuery({
    queryKey: ["emotions"],
    queryFn: () => getEmotionsServer({ limit: 100 }),
  });

  return (
    <section className={css.dairySection}>
      <div className={css.dairyContainer}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <DiaryPageClient />
        </HydrationBoundary>
      </div>
    </section>
  );
};

export default DiaryPage;
