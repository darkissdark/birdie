"use client";

import { DiaryEntry } from "@/types/dairy";
import Icon from "../Icon/Icon";
import css from "./DiaryEntryDetails.module.css";
import { useState } from "react";
import { AddDiaryEntryModal } from "../AddDiaryEntryModal/AddDiaryEntryModal";
import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";

interface DiaryEntryDetailsProps {
  entry: DiaryEntry;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

const DiaryEntryDetails = ({
  entry,
  onDelete,
  onUpdate,
}: DiaryEntryDetailsProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditConfirm = () => {
    setShowEditModal(false);
    onUpdate();
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    onDelete(entry._id);
  };

  if (!entry) return <p>Запис не знайдено</p>;

  const date = entry
    ? new Date(entry.date).toLocaleDateString("uk-UA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Немає дати";

  const title = entry.title || "Без назви";
  const description = entry.description || "Немає опису";
  const emotions = entry.emotions ?? [];

  return (
    <div className={css.diaryEntryDetails}>
      <div className={css.diaryEntryDetailsWrapper}>
        <div className={css.titleDateBtn}>
          <div className={css.diaryEntryDetailsTitleWrapper}>
            <h2 className={css.diaryEntryDetailsTitle}>{title}</h2>
            <button
              className={css.diaryEntryDetailsEditBtn}
              onClick={() => setShowEditModal(true)}
            >
              <Icon id="edit_icon" className={css.editBtn} />
            </button>
          </div>
          <div className={css.diaryEntryDetailsDateWrapper}>
            <p className={css.diaryEntryDetailsDate}>{date}</p>
            <button
              className={css.diaryEntryDetailsDeleteBtn}
              onClick={() => setShowDeleteModal(true)}
            >
              <Icon id="delete_icon" className={css.deleteBtn} />
            </button>
          </div>
        </div>

        <p className={css.diaryEntryDetailsContent}>{description}</p>

        <div>
          <ul className={css.diaryCardListItemWrapperEmotions}>
            {entry?.emotions?.length ? (
              emotions.map((emo) => (
                <li key={emo._id} className={css.emotionsItem}>
                  {emo.title}
                </li>
              ))
            ) : (
              <li>Немає емоцій</li>
            )}
          </ul>
        </div>

        {/* Модалка редагування / додавання */}
        {showEditModal && (
          <AddDiaryEntryModal
            isOpen={showEditModal}
            entry={entry}
            onClose={() => setShowEditModal(false)}
            onSuccess={handleEditConfirm}
          />
        )}
        {/* Модалка підтвердження видалення */}
        {showDeleteModal && (
          <ConfirmationModal
            title="Ви впевнені, що хочете видалити цей запис?"
            confirmButtonText="Так, видалити"
            cancelButtonText="Скасувати"
            onConfirm={handleDeleteConfirm}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DiaryEntryDetails;
