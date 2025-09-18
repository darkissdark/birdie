"use client";

import DiaryList from "@/components/DiaryList/DiaryList";
import css from "./DiaryPageClient.module.css";
import { useMediaQuery } from "react-responsive";
import { useEffect, useMemo, useState } from "react";
import DiaryEntryDetails from "@/components/DiaryEntryDetails/DiaryEntryDetails";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  DiaryListResponse,
  getDiaryList,
  deleteDiaryEntry,
} from "@/lib/api/clientApi";
import toast from "react-hot-toast";
import { DiaryEntry, SortOrder } from "@/types/diary";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

const DiaryPageClient = () => {
  const isDesktop = useMediaQuery({ minWidth: 1440 });
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<DiaryListResponse>({
    queryKey: ["diary", { sortOrder }],
    queryFn: ({ pageParam = 1 }) =>
      getDiaryList({ page: pageParam as number, sortOrder }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const entries = useMemo(() => {
    return data?.pages.flatMap((page) => page.diaryNotes) ?? [];
  }, [data?.pages]);

  useEffect(() => {
    if (entries.length > 0 && !selectedEntry && isDesktop) {
      setSelectedEntry(entries[0]);
    }
  }, [entries, selectedEntry, isDesktop]);

  const handleUpdateEntry = async (updatedEntry?: DiaryEntry) => {
    try {
      if (updatedEntry) {
        setSelectedEntry(updatedEntry);
        await refetch();
      } else {
        await refetch();
      }
    } catch (error) {
      console.error("Error updating entry:", error);
      toast.error("Помилка при оновленні запису");
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteDiaryEntry(id);

      if (selectedEntry?._id === id) {
        const remainingEntries = entries.filter((entry) => entry._id !== id);
        setSelectedEntry(
          remainingEntries.length > 0 ? remainingEntries[0] : null
        );
      }
      await refetch();
      toast.success("Запис успішно видалено!");
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Помилка при видаленні запису");
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error("Ooops... Something went wrong");
    }
  }, [isError]);

  if (isLoading) {
    return <LoadingSpinner message="Завантаження..." size="medium" />;
  }

  if (!isClient) {
    return <LoadingSpinner message="Завантаження..." size="medium" />;
  }

  return isDesktop ? (
    <>
      <div className={css.diaryMainWrapper}>
        <DiaryList
          entries={entries}
          setSortOrder={setSortOrder}
          sortOrder={sortOrder}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onSelect={(entry) => setSelectedEntry(entry)}
        />
        {selectedEntry && (
          <DiaryEntryDetails
            entry={selectedEntry}
            onDelete={handleDeleteEntry}
            onUpdate={handleUpdateEntry}
          />
        )}
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
