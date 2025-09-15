import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import css from "./DiaryPage.module.css";
import DiaryPageClient from "./DiaryPageClient";
import { getDiaryListServer } from "@/lib/api/serverApi";
import { DiaryListParams } from "@/lib/api/clientApi";

const DiaryPage = async () => {
  const queryClient = new QueryClient();
  const params: DiaryListParams = {
    page: 1,
    sortOrder: "asc",
  };

  await queryClient.prefetchQuery({
    queryKey: ["diary", params],
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
