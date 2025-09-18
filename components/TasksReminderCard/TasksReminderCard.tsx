"use client";

import css from "./TasksReminderCard.module.css";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Task } from "@/types/tasks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, updateTaskStatus } from "@/lib/api/clientApi";
import useAuthStore from "@/lib/store/authStore";
import { useState } from "react";
import AddTaskModal from "../AddTaskModal/AddTaskModal";
import AddTaskForm from "../AddTaskForm/AddTaskForm";
import { useRouter } from "next/navigation";
import TaskItem from "./TaskItem";
import EmptyState from "./EmptyState";

const TasksReminderCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
    enabled: !!isAuthenticated,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();

  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ taskId, isDone }: { taskId: string; isDone: boolean }) =>
      updateTaskStatus(taskId, isDone),

    onMutate: async ({ taskId, isDone }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          ["tasks"],
          previousTasks.map((task) =>
            task._id === taskId ? { ...task, isDone } : task
          )
        );
      }
      return { previousTasks };
    },

    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
      console.error("Error updating task status:", err);
    },
    onSettled: () => {
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
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddTaskClick = () => {
    if (isAuthenticated) {
      openModal();
    } else {
      router.push("/auth/register");
    }
  };

  return (
    <div className={css.tasksContainer}>
      <div className={css.tasksHeader}>
        <h2>Важливі завдання</h2>
        <button onClick={handleAddTaskClick} className={css.addTaskLink}>
          <IoIosAddCircleOutline className={css.addTask} />
        </button>
        {isModalOpen && isAuthenticated && (
          <AddTaskModal closeModal={closeModal}>
            <AddTaskForm onClose={closeModal} />
          </AddTaskModal>
        )}
      </div>
      <div className={css.wrapperTasksList}>
        {tasks.length === 0 ? (
          <EmptyState onClick={handleAddTaskClick} />
        ) : (
          <ul className={css.tasksList}>
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onChange={() =>
                  changeStatus({
                    taskId: task._id,
                    isDone: !task.isDone,
                  })
                }
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TasksReminderCard;
