import css from './DiaryEntryCard.module.css';

const DiaryEntryCard = () => {
  const handleItemListClick = () => {};

  return (
    <ul className={css.diaryCardList}>
      <li className={css.diaryCardListItem} onClick={handleItemListClick}>
        <div className={css.diaryCardListItemWrapper}>
          <p className={css.diaryCardListItemWrapperText}>Дивне бажання</p>
          <p className={css.diaryCardListItemWrapperDate}> 9 липня 2025</p>
        </div>
        <ul className={css.diaryCardListItemWrapperEmotions}>
          <li className={css.emotionsItem}>Натхнення</li>
          <li className={css.emotionsItem}>дивні бажання</li>
          <li className={css.emotionsItem}>дивні бажання</li>
          <li className={css.emotionsItem}>дивні бажання</li>
        </ul>
        {/* <div className={css.diaryCardListItemWrapperEmotions}>
          <p className={css.emotionsItem}>Натхнення</p>
          <p className={css.emotionsItem}>дивні бажання</p>
          <p className={css.emotionsItem}>дивні бажання</p>
          <p className={css.emotionsItem}>дивні бажання</p>
        </div> */}
      </li>
    </ul>
  );
};

export default DiaryEntryCard;
