"use client";
import { DiaryEntry } from "@/types/diary";
import { useEffect } from "react";
import { AddDiaryEntryForm } from "@/components/AddDiaryEntryForm/AddDiaryEntryForm";
import styles from "./AddDiaryEntryModal.module.css";

interface AddDiaryEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry?: DiaryEntry;
  onSuccess: (updatedEntry?: DiaryEntry) => void;
}

export const AddDiaryEntryModal: React.FC<AddDiaryEntryModalProps> = ({
  isOpen,
  onClose,
  entry,
  onSuccess,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {entry ? "Редагувати запис" : "Новий запис"}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
            aria-label="Закрити модальне вікно"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <AddDiaryEntryForm
            entry={entry}
            onSuccess={(updatedEntry) => {
              onSuccess(updatedEntry);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};
