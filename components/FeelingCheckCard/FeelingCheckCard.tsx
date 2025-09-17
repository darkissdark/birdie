"use client";
import { useState } from "react";
import { AddDiaryEntryModal } from "../AddDiaryEntryModal/AddDiaryEntryModal";
import css from "./FeelingCheckCard.module.css";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/store/authStore";

const FeelCard = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const handleMoodJournalClick = () => {
    if (user) {
      setIsModalOpen(true);
    } else {
      router.push("/auth/register");
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {};

  return (
    <>
      <div className={css.wellbeingContainer}>
        <h2 className={css.wellbeingTitle}>Як ви себе почуваєте?</h2>
        <div className={css.recommendationsSection}>
          <p className={css.recommendationsLabel}>Рекомендації на сьогодні:</p>
          <p className={css.recommendationsText}>
            Занотуйте незвичні відчуття у тілі.
          </p>
        </div>
        <button
          onClick={(e) => {
            handleMoodJournalClick();
            e.currentTarget.blur();
          }}
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
