"use client";
import { IoIosAddCircleOutline } from "react-icons/io";
import css from "./DiaryList.module.css";
import DiaryEntryCard from "../DiaryEntryCard/DiaryEntryCard";
import { useCallback, useMemo, useRef, useState } from "react";
import { AddDiaryEntryModal } from "../AddDiaryEntryForm";
import { useQueryClient } from "@tanstack/react-query";
import { HiArrowsUpDown } from "react-icons/hi2";
import { DiaryEntryData, SortOrder } from "@/types/diary";

interface DiaryListProps {
  entries: DiaryEntryData[];
  onSelect?: (entry: DiaryEntryData) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

const DiaryList = ({
  entries,
  onSelect,
  sortOrder,
  setSortOrder,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: DiaryListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasValidDates = entries?.some((e) => e.date);
  const queryClient = useQueryClient();
  const observer = useRef<IntersectionObserver | null>(null);

  const lastEntryRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  const handleToggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const uniqueEntries = useMemo(
    () =>
      entries.filter(
        (entry, index, self) =>
          self.findIndex((e) => e._id === entry._id) === index
      ),
    [entries]
  );

  return (
    <div className={css.diaryWrapper}>
      <h1 className={css.visuallyHidden}>Щоденник</h1>

      <div className={css.titleWrapper}>
        <div className={css.titlesort}>
          <h2 className={css.subtitle}>Ваші записи</h2>
          <button className={css.sortButton} onClick={handleToggleSort}>
            <HiArrowsUpDown className={css.sortLogo} />
          </button>
        </div>

        <div className={css.wrapper}>
          <button
            type="button"
            className={css.addButton}
            onClick={handleOpenModal}
          >
            Новий запис
            <IoIosAddCircleOutline className={css.addLogo} />
          </button>
        </div>
      </div>

      <div className={css.wrapperList}>
        {hasValidDates ? (
          <>
            <ul className={css.diaryCardList}>
              {uniqueEntries.map((entry, index) => {
                const isLast = index === uniqueEntries.length - 1;
                return (
                  <DiaryEntryCard
                    key={entry._id}
                    entry={entry}
                    onSelect={onSelect}
                    ref={isLast ? lastEntryRef : null}
                  />
                );
              })}
            </ul>
            {isFetchingNextPage && (
              <div className={css.loadingMore}>
                Завантаження додаткових записів...
              </div>
            )}
            {!hasNextPage &&
              !isFetchingNextPage &&
              uniqueEntries.length > 0 && (
                <div className={css.endOfList}>Всі записи завантажено</div>
              )}
          </>
        ) : (
          <p className={css.warningText}>Наразі записів немає</p>
        )}
        {isModalOpen && (
          <AddDiaryEntryModal
            onClose={handleCloseModal}
            isOpen={isModalOpen}
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["diary"] })
            }
          />
        )}
      </div>
    </div>
  );
};

export default DiaryList;
