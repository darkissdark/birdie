import css from "./DiaryEntryCard.module.css";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";
import { DiaryEntryData } from "@/types/diary";

interface DiaryEntryCardProps {
  entry: DiaryEntryData;
  onSelect?: (entry: DiaryEntryData) => void;
}

const DiaryEntryCard = forwardRef<HTMLLIElement, DiaryEntryCardProps>(
  ({ entry, onSelect }, ref) => {
    const router = useRouter();
    const isDesktop = useMediaQuery({ minWidth: 1440 });

    const handleItemListClick = () => {
      if (isDesktop) {
        if (onSelect) {
          onSelect(entry);
        }
      } else {
        sessionStorage.setItem("selectedEntry", JSON.stringify(entry));
        router.push(`/diary/${entry._id}`);
      }
    };

    const date = new Date(entry.date).toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <li
        className={css.diaryCardListItem}
        onClick={handleItemListClick}
        ref={ref}
      >
        <div className={css.diaryCardListItemWrapper}>
          <h3 className={css.diaryCardListItemWrapperText}>{entry.title}</h3>
          <p className={css.diaryCardListItemWrapperDate}>{date}</p>
        </div>
        <ul className={css.diaryCardListItemWrapperEmotions}>
          {entry.emotions.map((emo) => (
            <li key={emo._id} className={css.emotionsItem}>
              {emo.title}
            </li>
          ))}
        </ul>
      </li>
    );
  }
);
DiaryEntryCard.displayName = "DiaryEntryCard";

export default DiaryEntryCard;
