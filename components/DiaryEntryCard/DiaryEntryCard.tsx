import { DiaryEntry } from "@/types/dairy";
import css from "./DiaryEntryCard.module.css";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";
import { Emotion } from "@/lib/api/clientApi";

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  emotions: Emotion[];
  onSelect?: (entry: DiaryEntry) => void;
}

const DiaryEntryCard = ({ entry, emotions, onSelect }: DiaryEntryCardProps) => {
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

  const getEmotionTitle = (emotionId: string) => {
    const emotion = emotions.find((emo) => emo._id === emotionId);
    return emotion?.title || "Невідома емоція";
  };

  return (
    <li className={css.diaryCardListItem} onClick={handleItemListClick}>
      <div className={css.diaryCardListItemWrapper}>
        <p className={css.diaryCardListItemWrapperText}>{entry.title}</p>
        <p className={css.diaryCardListItemWrapperDate}>{date}</p>
      </div>
      <ul className={css.diaryCardListItemWrapperEmotions}>
        {entry.emotions.map((emo, index) => (
          <li key={`${emo}-${index}`} className={css.emotionsItem}>
            {getEmotionTitle(emo)}
          </li>
        ))}
      </ul>
    </li>
  );
};

export default DiaryEntryCard;
