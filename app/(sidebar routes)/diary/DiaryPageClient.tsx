"use client";

import DiaryList from "@/components/DiaryList/DiaryList";
import css from "./DiaryPageClient.module.css";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import DiaryEntryDetails from "@/components/DiaryEntryDetails/DiaryEntryDetails";
import { useQuery } from "@tanstack/react-query";
import {
  DiaryListResponse,
  getDiaryList,
  getEmotions,
} from "@/lib/api/clientApi";
import toast from "react-hot-toast";
import { SortOrder } from "@/types/dairy";

const DiaryPageClient = () => {
  const isDesktop = useMediaQuery({ minWidth: 1440 });
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page] = useState<number>(1);
  const params = { page, sortOrder };
  const { data, isLoading, isError } = useQuery<DiaryListResponse>({
    queryKey: ["diary", params],
    queryFn: () => getDiaryList(params),
  });

  const { data: emotionsData, isLoading: emotionsLoading } = useQuery({
    queryKey: ["emotions"],
    queryFn: () => getEmotions({ limit: 100 }),
  });

  useEffect(() => {
    if (isError) {
      toast.error("Ooops... Something went wrong");
    }
  }, [isError]);

  if (isLoading || emotionsLoading) {
    return <p>Loading...</p>;
  }

  const entries = data?.diaryNotes ?? [];
  const emotions = emotionsData?.emotions ?? [];

  return isDesktop ? (
    <div className={css.diaryMainWrapper}>
      <DiaryList
        entries={entries}
        emotions={emotions}
        setSortOrder={setSortOrder}
        sortOrder={sortOrder}
      />
      <DiaryEntryDetails />
    </div>
  ) : (
    <DiaryList
      entries={entries}
      emotions={emotions}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
    />
  );
};

export default DiaryPageClient;
