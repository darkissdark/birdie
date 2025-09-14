import { useState } from "react";
import { AddDiaryEntryModal } from '../AddDiaryEntryModal/AddDiaryEntryModal'; 
import css from './FeelingCheckCard.module.css';

const FeelCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoodJournalClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
  };

  return (
    <>
      <div className={css.wellbeingContainer}>
        <h2 className={css.wellbeingTitle}>
          Як ви себе почуваєте?
        </h2>
        <div className={css.recommendationsSection}>
          <p className={css.recommendationsLabel}>
            Рекомендації на сьогодні:
          </p>
          <p className={css.recommendationsText}>
            Запропонуйте незвичні відчуття у тілі.
          </p>
        </div>
        <button
          onClick={handleMoodJournalClick}
          className={css.journalButton}
        >
          Зробити запис у щоденник
        </button>
      </div>

      <AddDiaryEntryModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default FeelCard;