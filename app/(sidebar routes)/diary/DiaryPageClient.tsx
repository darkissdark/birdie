"use client";

import DiaryList from "@/components/DiaryList/DiaryList";
import css from "./DiaryPageClient.module.css";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import DiaryEntryDetails from "@/components/DiaryEntryDetails/DiaryEntryDetails";
import { useQuery } from "@tanstack/react-query";
import { DiaryListResponse, getDiaryList } from "@/lib/api/clientApi";
import toast from "react-hot-toast";
import { DiaryEntry, SortOrder } from "@/types/dairy";

const DiaryPageClient = () => {
  const isDesktop = useMediaQuery({ minWidth: 1440 });
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState<number>(1);
  const params = { page, sortOrder };
  const { data, isLoading, isError } = useQuery<DiaryListResponse>({
    queryKey: ["diary", params],
    queryFn: () => getDiaryList(params),
  });

  useEffect(() => {
    if (isError) {
      toast.error("Ooops... Something went wrong");
    }
  }, [isError]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const entries = data?.diaryNotes ?? [];

  return isDesktop ? (
    <div className={css.diaryMainWrapper}>
      <DiaryList
        entries={entries}
        onSelect={setSelectedEntry}
        setSortOrder={setSortOrder}
        sortOrder={sortOrder}
      />
      <DiaryEntryDetails />
    </div>
  ) : (
    <DiaryList
      entries={entries}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
    />
  );
};

export default DiaryPageClient;
