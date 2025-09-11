import { IoIosAddCircleOutline } from "react-icons/io";
import css from "./DiaryList.module.css";
import DiaryEntryCard from "../DiaryEntryCard/DiaryEntryCard";
import { DiaryEntry } from "@/types/dairy";

interface DiaryListProps {
  entries: DiaryEntry[];
}

const DiaryList = ({ entries }: DiaryListProps) => {
  const hasValidDates = entries?.some((e) => e.date);

  const handleClick = () => {
    // Логіка модалки AddDiaryEntryModal
  };

  return (
    <div className={css.diaryWrapper}>
      <h1 className={css.visuallyHidden}>Щоденник</h1>

      <div className={css.titleWrapper}>
        <h2 className={css.subtitle}>Ваші записи</h2>

        <div className={css.wrapper} onClick={handleClick}>
          <button type="button" className={css.addButton}>
            Новий запис
            <IoIosAddCircleOutline className={css.addLogo} />
          </button>
        </div>
      </div>
      {hasValidDates ? (
        <ul className={css.diaryCardList}>
          {entries.map((entry, index) => (
            <DiaryEntryCard key={index} entry={entry} />
          ))}
        </ul>
      ) : (
        <p className={css.warningText}>Наразі записів немає</p>
      )}
    </div>
  );
};

export default DiaryList;
