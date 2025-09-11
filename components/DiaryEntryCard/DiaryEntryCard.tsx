import { DiaryEntry } from "@/types/dairy";
import css from "./DiaryEntryCard.module.css";

interface DiaryEntryCardProps {
  entry: DiaryEntry;
}

const DiaryEntryCard = ({ entry }: DiaryEntryCardProps) => {
  const handleItemListClick = () => {};

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
        {entry.emotions.map((emo) => (
          <li key={emo._id} className={css.emotionsItem}>
            {emo.title}
          </li>
        ))}
      </ul>
    </li>
  );
};

export default DiaryEntryCard;
