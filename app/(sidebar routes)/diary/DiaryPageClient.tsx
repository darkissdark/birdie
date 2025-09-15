"use client";

import DiaryList from "@/components/DiaryList/DiaryList";
import css from "./DiaryPageClient.module.css";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import DiaryEntryDetails from "@/components/DiaryEntryDetails/DiaryEntryDetails";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DiaryListResponse, getDiaryList } from "@/lib/api/clientApi";
import toast from "react-hot-toast";
import { SortOrder } from "@/types/dairy";
import Greeting from "@/components/GreetingBlock/GreetingBlock";

const DiaryPageClient = () => {
  const isDesktop = useMediaQuery({ minWidth: 1440 });
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<DiaryListResponse>({
    queryKey: ["diary", sortOrder],
    queryFn: ({ pageParam = 1 }) =>
      getDiaryList({ page: pageParam as number, sortOrder }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Ooops... Something went wrong");
    }
  }, [isError]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const entries = data?.pages.flatMap((page) => page.diaryNotes) ?? [];

  return isDesktop ? (
    <>
      <Greeting />
      <div className={css.diaryMainWrapper}>
        <DiaryList
          entries={entries}
          setSortOrder={setSortOrder}
          sortOrder={sortOrder}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
        <DiaryEntryDetails />
      </div>
    </>
  ) : (
    <DiaryList
      entries={entries}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
};

export default DiaryPageClient;
