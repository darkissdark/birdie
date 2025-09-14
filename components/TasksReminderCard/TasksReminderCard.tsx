import css from "./TasksReminderCard.module.css";
import { IoIosAddCircleOutline } from "react-icons/io";
import { BiCheck } from "react-icons/bi";
import Link from "next/link";
import { Task } from "@/types/tasks";

interface TasksReminderCardProps {
  tasks: Task[];
  isAuth: boolean;
  onChangeStatus?: (taskId: string, isDone: boolean) => void;
}

const TasksReminderCard = ({
  tasks,
  isAuth,
  onChangeStatus,
}: TasksReminderCardProps) => {
  return (
    <div className={css.tasksContainer}>
      <div className={css.tasksHeader}>
        <h2>Важливі завдання</h2>
        {isAuth && (
          <Link className={css.addTaskLink} href="/auth/register">
            <IoIosAddCircleOutline className={css.addTask} />
          </Link>
        )}
      </div>
      <div className={css.tasksList}>
        {tasks.length === 0 ? (
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
            {tasks.map((task) => (
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
                        readOnly={!onChangeStatus}
                        onChange={() =>
                          onChangeStatus &&
                          onChangeStatus(task._id, !task.isDone)
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
// import css from "./TasksReminderCard.module.css";
// import { IoIosAddCircleOutline } from "react-icons/io";
// import { BiCheck } from "react-icons/bi";
// import { getTasks, checkSession } from "@/lib/api/clientApi";
// import { Task } from "@/types/tasks";
// import { useQuery } from "@tanstack/react-query";
// import Link from "next/link";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { updateTaskStatus } from "@/lib/api/clientApi";

// const TasksReminderCard = () => {

//   const { data: isAuth, isLoading: isAuthLoading } = useQuery<boolean>({
//     queryKey: ["session"],
//     queryFn: checkSession,
//   });

//   const {
//     data: tasks = [],
//     isLoading,
//     isError,
//     refetch,
//   } = useQuery<Task[]>({
//     queryKey: ["tasks"],
//     queryFn: getTasks,
//     enabled: !!isAuth,
//   });

//   const queryClient = useQueryClient();

//   const { mutate: changeStatus } = useMutation({
//     mutationFn: ({ taskId, isDone }: { taskId: string; isDone: boolean }) =>
//       updateTaskStatus(taskId, isDone),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["tasks"] });
//     },
//   });

//   if (isAuthLoading) {
//     return <div className={css.tasksContainer}>Перевірка авторизації...</div>;
//   }

//   if (!isAuth) {
//     return (
//       <div className={css.tasksContainer}>
//         Увійдіть, щоб переглянути завдання
//       </div>
//     );
//   }

//   if (isLoading) {
//     return <div className={css.tasksContainer}>Завантаження...</div>;
//   }

//   if (isError) {
//     return (
//       <div className={css.tasksContainer}>
//         Щось пішло не так. Спробуйте перезавантажити сторінку.
//         <button onClick={() => refetch()}>Оновити</button>
//       </div>
//     );
//   }

//   return (
//     <div className={css.tasksContainer}>
//       <div className={css.tasksHeader}>
//         <h2>Важливі завдання</h2>
//         {!isAuth ? (
//           <Link className={css.addTaskLink} href="/auth/register">
//             <IoIosAddCircleOutline className={css.addTask} />
//           </Link>
//         ) : (
//           <Link className={css.addTaskLink} href="/auth/register">
//             <IoIosAddCircleOutline className={css.addTask} />
//           </Link>
//         )}
//       </div>
//       <div className={css.tasksList}>
//         {tasks.length === 0 ? (
//           <div>
//             <h3 className={css.noTasks}>Наразі немає жодних завдань</h3>
//             <p className={css.noTasksDescription}>
//               Створіть мершій нове завдання!
//             </p>
//             <Link className={css.addTaskButton} href="/auth/register">
//               Створити завдання
//             </Link>
//           </div>
//         ) : (
//           <ul className={css.tasksList}>
//             {tasks.map((task) => (
//               <li key={task._id} className={css.tasksListItem}>
//                 <label htmlFor={`task-${task._id}`} className={css.taskLabel}>
//                   <div className={css.checkWrapper}>
//                     <div
//                       className={
//                         task.isDone
//                           ? `${css.checkImitationTrue}`
//                           : `${css.checkImitationFalse}`
//                       }
//                     >
//                       <input
//                         className={css.check}
//                         type="checkbox"
//                         id={`task-${task._id}`}
//                         checked={task.isDone}
//                         readOnly={false}
//                         onChange={() =>
//                           changeStatus({
//                             taskId: task._id,
//                             isDone: !task.isDone,
//                           })
//                         }
//                       />
//                       <BiCheck
//                         className={
//                           task.isDone ? css.checkIconTrue : css.checkIconFalse
//                         }
//                       />
//                     </div>
//                   </div>
//                   <div className={css.taskTextWrapper}>
//                     <span className={css.data}>{task.date}</span>
//                     <p className={css.taskDescription}>{task.name}</p>
//                   </div>
//                 </label>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TasksReminderCard;
