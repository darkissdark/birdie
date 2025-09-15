import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import css from "./AddTaskModal.module.css";
import { IoIosClose } from "react-icons/io";

interface TaskModalProps {
  children: React.ReactNode;
  closeModal: () => void;
}

const AddTaskModal = ({ children, closeModal }: TaskModalProps) => {
  const elRef = useRef(document.createElement("div"));
  const el = elRef.current;

  useEffect(() => {
    document.body.appendChild(el);
    document.body.style.overflow = "hidden";

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", onEsc);

    return () => {
      document.body.removeChild(el);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onEsc);
    };
  }, [el, closeModal]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <IoIosClose onClick={closeModal} className={css.closeButton} />
        <h2 className={css.taskTitle}>Нове завдання</h2>
        {children}
      </div>
    </div>,
    el
  );
};

export default AddTaskModal;
