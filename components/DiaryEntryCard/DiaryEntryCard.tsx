import { DiaryEntry } from "@/types/dairy";
import css from "./DiaryEntryCard.module.css";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  onSelect?: (entry: DiaryEntry) => void;
}

const DiaryEntryCard = ({ entry, onSelect }: DiaryEntryCardProps) => {
  const router = useRouter();
  const isDesktop = useMediaQuery({ minWidth: 1440 });

  const handleItemListClick = () => {
    if (!isDesktop) {
      router.push(`/diary/${entry._id}`);
    }

    if (onSelect) {
      onSelect(entry);
    }
  };

  const date = new Date(entry.date).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <li className={css.diaryCardListItem} onClick={handleItemListClick}>
      <div className={css.diaryCardListItemWrapper}>
        <p className={css.diaryCardListItemWrapperText}>{entry.title}</p>
        <p className={css.diaryCardListItemWrapperDate}>{date}</p>
      </div>
      <ul className={css.diaryCardListItemWrapperEmotions}>
        {entry.emotions.map((emo, index) => (
          <li key={`${emo._id}-${index}`} className={css.emotionsItem}>
            {emo.title}
          </li>
        ))}
      </ul>
    </li>
  );
};

export default DiaryEntryCard;
