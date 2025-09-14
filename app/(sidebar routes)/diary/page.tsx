import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import css from "./DiaryPage.module.css";
import DiaryPageClient from "./DiaryPageClient";
import { getDiaryListServer } from "@/lib/api/serverApi";

const DiaryPage = async () => {
  const queryClient = new QueryClient();
  const params: { page: number } = {
    page: 1,
  };
  await queryClient.prefetchQuery({
    queryKey: ["diary"],
    queryFn: () => getDiaryListServer(params),
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
