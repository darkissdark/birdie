"use client";

import DiaryList from "@/components/DiaryList/DiaryList";
import css from "./DiaryPageClient.module.css";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import DiaryEntryDetails from "@/components/DiaryEntryDetails/DiaryEntryDetails";
import { useQuery } from "@tanstack/react-query";
import { DiaryListResponse, getDiaryList } from "@/lib/api/clientApi";
import toast from "react-hot-toast";
import { DiaryEntry } from "@/types/dairy";

const DiaryPageClient = () => {
  const isDesktop = useMediaQuery({ minWidth: 1440 });
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  const { data, isLoading, isError } = useQuery<DiaryListResponse>({
    queryKey: ["diary"],
    queryFn: () => getDiaryList(),
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
      <DiaryList entries={entries} onSelect={setSelectedEntry} />
      <DiaryEntryDetails />
    </div>
  ) : (
    <DiaryList entries={entries} />
  );
};

export default DiaryPageClient;
