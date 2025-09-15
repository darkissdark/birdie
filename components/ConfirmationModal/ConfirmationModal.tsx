import { useEffect } from "react";
import React from "react";
import css from "./ConfirmationModal.module.css";
import { IoIosClose } from "react-icons/io";

type ConfirmationModalProps = {
  title: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };
  return (
    <div onClick={handleBackdropClick} className={css.backdrop}>
      <div className={css.modal}>
        <IoIosClose
          onClick={onCancel}
          className={css.closeButton}
          aria-label="Close modal"
        />
        <h2 className={css.title}>{title}</h2>
        <div className={css.form}>
          <button onClick={onCancel} className={css.confbtn}>
            {cancelButtonText}
          </button>
          <button onClick={onConfirm} className={css.confbtn}>
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};
