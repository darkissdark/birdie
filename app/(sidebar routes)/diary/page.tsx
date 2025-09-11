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

  await queryClient.prefetchQuery({
    queryKey: ["diary"],
    queryFn: () => getDiaryListServer(),
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
