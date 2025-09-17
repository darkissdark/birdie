import css from "./TasksReminderCard.module.css";
import { BiCheck } from "react-icons/bi";
import { Task } from "../../types/task";

const TaskItem = ({ task, onChange }: { task: Task; onChange: () => void }) => {
  return (
    <li key={task._id} className={css.tasksListItem}>
      <label htmlFor={`task-${task._id}`} className={css.taskLabel}>
        <div className={css.checkWrapper}>
          <div
            className={
              task.isDone ? css.checkImitationTrue : css.checkImitationFalse
            }
          >
            <input
              className={css.check}
              type="checkbox"
              id={`task-${task._id}`}
              checked={task.isDone}
              readOnly={false}
              onChange={onChange}
            />
            <BiCheck
              className={task.isDone ? css.checkIconTrue : css.checkIconFalse}
            />
          </div>
        </div>
        <div className={css.taskTextWrapper}>
          <span className={css.data}>{task.date}</span>
          <p
            className={
              task.isDone
                ? `${css.taskDescription} ${css.taskDone}`
                : css.taskDescription
            }
          >
            {task.name}
          </p>
        </div>
      </label>
    </li>
  );
};

export default TaskItem;
