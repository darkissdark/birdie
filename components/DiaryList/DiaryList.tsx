"use client";
import {
  IoIosAddCircleOutline,
  IoIosArrowDropdown,
  IoIosArrowDropup,
} from "react-icons/io";
import css from "./DiaryList.module.css";
import DiaryEntryCard from "../DiaryEntryCard/DiaryEntryCard";
import { DiaryEntry } from "@/types/dairy";
import { useState } from "react";

interface DiaryListProps {
  entries: DiaryEntry[];
  onSelect?: (entry: DiaryEntry) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
}

const DiaryList = ({
  entries,
  onSelect,
  sortOrder,
  setSortOrder,
}: DiaryListProps) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const hasValidDates = entries?.some((e) => e.date);
  const [isSortTrue, setIsSortTrue] = useState(true);

  const handleToogleSort = () => {
    setIsSortTrue(!isSortTrue);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    // На апі йдуть запроси нормальні, як у свагері описано, а у відповідь одне й теж сортування
  };

  // Логіка модалки AddDiaryEntryModal
  const handleClick = () => {};

  return (
    <div className={css.diaryWrapper}>
      <h1 className={css.visuallyHidden}>Щоденник</h1>

      <div className={css.titleWrapper}>
        <div className={css.titlesort}>
          <h2 className={css.subtitle}>Ваші записи</h2>
          <button className={css.sortButton} onClick={handleToogleSort}>
            {isSortTrue ? (
              <IoIosArrowDropdown className={css.sortLogo} />
            ) : (
              <IoIosArrowDropup className={css.sortLogo} />
            )}
          </button>
        </div>

        <div className={css.wrapper} onClick={handleClick}>
          <button type="button" className={css.addButton}>
            Новий запис
            <IoIosAddCircleOutline className={css.addLogo} />
          </button>
        </div>
      </div>

      <div className={css.wrapperList}>
        {hasValidDates ? (
          <ul className={css.diaryCardList}>
            {entries.map((entry) => (
              <DiaryEntryCard
                key={entry._id}
                entry={entry}
                onSelect={onSelect}
              />
            ))}
          </ul>
        ) : (
          <p className={css.warningText}>Наразі записів немає</p>
        )}
        {/* {isModalOpen && (
          <AddDiaryEntryModal onClose={() => setIsModalOpen(false)} />
        )} */}
      </div>
    </div>
  );
};

export default DiaryList;
