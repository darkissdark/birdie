"use client";
import { IoIosAddCircleOutline } from "react-icons/io";
import css from "./DiaryList.module.css";
import DiaryEntryCard from "../DiaryEntryCard/DiaryEntryCard";
import { DiaryEntry } from "@/types/dairy";
// import { useState } from "react";

interface DiaryListProps {
  entries: DiaryEntry[];
  onSelect?: (entry: DiaryEntry) => void;
}

const DiaryList = ({ entries, onSelect }: DiaryListProps) => {
  // const [isSort, setIsSort] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const hasValidDates = entries?.some((e) => e.date);

  //Логіка сортування
  // const handleToogleSort = () => {
  //   setIsSort(!isSort);
  // };

  // Логіка модалки AddDiaryEntryModal
  const handleClick = () => {
    // setIsModalOpen(true);
  };

  return (
    <div className={css.diaryWrapper}>
      <h1 className={css.visuallyHidden}>Щоденник</h1>

      <div className={css.titleWrapper}>
        <div className={css.titlesort}>
          <h2 className={css.subtitle}>Ваші записи</h2>
          {/* <button className={css.sortButton} onClick={handleToogleSort}>
            {isSort ? (
              <IoIosArrowDropup className={css.sortLogo} />
            ) : (
              <IoIosArrowDropdown className={css.sortLogo} />
            )}
          </button> */}
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
