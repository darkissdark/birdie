"use client";

import css from "./TasksReminderCard.module.css";
import { IoIosAddCircleOutline } from "react-icons/io";
import { BiCheck } from "react-icons/bi";
import Link from "next/link";
import { Task } from "@/types/tasks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, updateTaskStatus } from "@/lib/api/clientApi";
import useAuthStore from "@/lib/store/authStore";

const TasksReminderCard = () => {
  const { isAuthenticated } = useAuthStore();

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
    enabled: !!isAuthenticated,
  });

  const queryClient = useQueryClient();

  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ taskId, isDone }: { taskId: string; isDone: boolean }) =>
      updateTaskStatus(taskId, isDone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  if (tasksLoading) {
    return <div className={css.tasksContainer}>Завантаження завдань...</div>;
  }

  if (tasksError) {
    return (
      <div className={css.tasksContainer}>
        Щось пішло не так. Спробуйте перезавантажити сторінку.
      </div>
    );
  }

  return (
    <div className={css.tasksContainer}>
      <div className={css.tasksHeader}>
        <h2>Важливі завдання</h2>
        {isAuthenticated && (
          <Link className={css.addTaskLink} href="/auth/register">
            <IoIosAddCircleOutline className={css.addTask} />
          </Link>
        )}
      </div>
      <div className={css.tasksList}>
        {tasks?.length === 0 ? (
          <div>
            <h3 className={css.noTasks}>Наразі немає жодних завдань</h3>
            <p className={css.noTasksDescription}>
              Створіть мершій нове завдання!
            </p>
            <Link className={css.addTaskButton} href="/auth/register">
              Створити завдання
            </Link>
          </div>
        ) : (
          <ul className={css.tasksList}>
            {tasks?.map((task) => (
              <li key={task._id} className={css.tasksListItem}>
                <label htmlFor={`task-${task._id}`} className={css.taskLabel}>
                  <div className={css.checkWrapper}>
                    <div
                      className={
                        task.isDone
                          ? `${css.checkImitationTrue}`
                          : `${css.checkImitationFalse}`
                      }
                    >
                      <input
                        className={css.check}
                        type="checkbox"
                        id={`task-${task._id}`}
                        checked={task.isDone}
                        readOnly={false}
                        onChange={() =>
                          changeStatus({
                            taskId: task._id,
                            isDone: !task.isDone,
                          })
                        }
                      />
                      <BiCheck
                        className={
                          task.isDone ? css.checkIconTrue : css.checkIconFalse
                        }
                      />
                    </div>
                  </div>
                  <div className={css.taskTextWrapper}>
                    <span className={css.data}>{task.date}</span>
                    <p className={css.taskDescription}>{task.name}</p>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TasksReminderCard;
