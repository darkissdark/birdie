import css from "./AddTaskForm.module.css";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/lib/api/clientApi";
import type { CreateTask, Task } from "../../types/task";
import Button from "../Button/Button";
import AddTaskDatePicker from "../AddTaskDatePicker/AddTaskDatePicker";
import toast from "react-hot-toast";


interface TaskFormProps {
  onClose: () => void;
}
const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Завдання повинно містити не менше 3 символів")
    .max(50, "Завдання повинно містити не більше 50 символів")
    .required("Обов'язкове поле"),
  date: Yup.date()
    .default(() => new Date())
    .typeError("Введіть коректну дату"),
});

const AddTaskForm = ({ onClose }: TaskFormProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<Task, Error, CreateTask>({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.refetchQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Error creating task:", error);
    },
  });

  const handleSubmit = (
    values: CreateTask,
    actions: FormikHelpers<CreateTask>
  ) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success("Завдання успішно створено!");
        actions.resetForm();
        onClose();
      },
      onError: (error) => {
        toast.success("Помилка при створенні завдання.");
        console.error("Error submitting task:", error);
      },
    });
  };

  return (
    <Formik
      validationSchema={ValidationSchema}
      initialValues={{ name: "", date: new Date().toISOString() }}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Form className={css.form}>
          <div className={css.formDiv}>
            <label htmlFor="name">Назва завдання</label>
            <Field
              id="name"
              type="text"
              name="name"
              placeholder="Прийняти вітаміни"
              className={`${css.name} ${css.inputField}  ${formik.touched.name && formik.errors.name ? css.error : ""}`}
            />
            <ErrorMessage name="name" component="div" className={css.error} />
          </div>
          <div className={css.formDiv}>
            <label htmlFor="date">Дата</label>
            <AddTaskDatePicker
              value={formik.values.date}
              onChange={(date) => formik.setFieldValue("date", date)}
              placeholder={""}
            />
            <ErrorMessage name="date" component="div" />
          </div>
          <div className={css.saveButton}>
            <Button type="submit" variant="primary" disabled={!formik.isValid}>
              Зберегти
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddTaskForm;
