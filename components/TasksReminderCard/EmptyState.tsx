import css from "./TasksReminderCard.module.css";

const EmptyState = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent) => void;
}) => {
  return (
    <div>
      <h3 className={css.noTasks}>Наразі немає жодних завдань</h3>
      <p className={css.noTasksDescription}>Створіть мерщій нове завдання!</p>
      <button
        onClick={(e) => {
          onClick(e);
          e.currentTarget.blur();
        }}
        className={css.addTaskButton}
      >
        Створити завдання
      </button>
    </div>
  );
};

export default EmptyState;
