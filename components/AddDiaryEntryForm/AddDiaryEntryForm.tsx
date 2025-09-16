"use client";
import { DiaryEntry, DiaryFormValues } from "@/types/diary";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import styles from "./AddDiaryEntryForm.module.css";
import Button from "@/components/Button/Button";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { useEmotions } from "@/lib/hooks/useEmotions";

interface AddDiaryEntryFormProps {
  entry?: DiaryEntry;
  onSuccess: (updatedEntry?: DiaryEntry) => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(2, "Заголовок повинен містити принаймні 2 символи")
    .max(100, "Заголовок не може перевищувати 100 символів")
    .required("Заголовок є обов'язковим полем"),
  description: Yup.string()
    .min(10, "Запис повинен містити принаймні 10 символів")
    .max(1000, "Запис не може перевищувати 1000 символів")
    .required("Опис є обов'язковим полем"),
  emotions: Yup.array()
    .of(Yup.string())
    .min(1, "Оберіть принаймні одну категорію")
    .required("Емоції є обов'язковим полем"),
});

const CustomErrorMessage: React.FC<{ error?: string; touched?: boolean }> = ({
  error,
  touched,
}) => {
  return (
    <div className={styles.errorMessageContainer}>
      <div
        className={`${styles.errorMessage} ${
          error && touched ? styles.visible : ""
        }`}
      >
        {error || ""}
      </div>
    </div>
  );
};

export const AddDiaryEntryForm: React.FC<AddDiaryEntryFormProps> = ({
  entry,
  onSuccess,
}) => {
  const {
    emotions,
    loading: emotionsLoading,
    error: emotionsError,
    hasMore,
    loadingMore,
    loadMore,
    retry: retryLoadEmotions,
  } = useEmotions(10);

  const initialValues: DiaryFormValues = {
    title: entry?.title || "",
    description: entry?.description || "",
    emotions: entry?.emotions
      ? entry.emotions.map((emotion) =>
          typeof emotion === "string" ? emotion : emotion._id
        )
      : [],
  };

  const handleSubmit = async (
    values: DiaryFormValues,
    { setSubmitting }: FormikHelpers<DiaryFormValues>
  ) => {
    try {
      const submitData = {
        title: values.title,
        description: values.description,
        emotions: values.emotions,
      };

      if (entry) {
        const response = await api.patch(`/diary/${entry._id}`, submitData);
        const updatedEntry = response.data;
        
        toast.success("Запис успішно оновлено!");
        onSuccess(updatedEntry);
      } else {
        const response = await api.post("/diary", submitData);
        const newEntry = response.data;
        
        toast.success("Запис успішно створено!");
        onSuccess(newEntry);
      }
    } catch (error: unknown) {
      let errorMessage = "Сталася помилка при збереженні запису";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: { message?: string };
          };
          message?: string;
        };

        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue, errors, touched }) => (
          <Form className={styles.form}>
            <div className={styles.fieldGroup}>
              <label htmlFor="title" className={styles.label}>
                Заголовок
              </label>
              <Field
                id="title"
                name="title"
                type="text"
                className={`${styles.input} ${
                  errors.title && touched.title ? styles.error : ""
                }`}
                placeholder="Введіть заголовок запису"
              />
              <CustomErrorMessage
                error={errors.title}
                touched={touched.title}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Категорії</label>

              {emotionsError ? (
                <div className={styles.errorContainer}>
                  <div className={styles.errorMessage}>
                    Помилка: {emotionsError}
                  </div>
                  <button
                    type="button"
                    onClick={retryLoadEmotions}
                    className={styles.retryButton}
                  >
                    Спробувати знову
                  </button>
                </div>
              ) : emotions.length === 0 && !emotionsLoading ? (
                <div className={styles.noDataContainer}>
                  <span>Категорії не знайдено</span>
                  <button
                    type="button"
                    onClick={retryLoadEmotions}
                    className={styles.retryButton}
                  >
                    Оновити
                  </button>
                </div>
              ) : (
                <MultiSelectDropdown
                  options={emotions}
                  selectedValues={values.emotions}
                  onSelectionChange={(selectedIds) =>
                    setFieldValue("emotions", selectedIds)
                  }
                  placeholder="Оберіть категорію"
                  error={Boolean(errors.emotions && touched.emotions)}
                  loading={emotionsLoading}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                  loadingMore={loadingMore}
                />
              )}

              <CustomErrorMessage
                error={errors.emotions as string}
                touched={touched.emotions}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="description" className={styles.label}>
                Запис
              </label>
              <Field
                id="description"
                name="description"
                as="textarea"
                className={`${styles.textarea} ${
                  errors.description && touched.description ? styles.error : ""
                }`}
                placeholder="Запишіть, як ви себе відчуваєте"
                rows={5}
              />
              <CustomErrorMessage
                error={errors.description}
                touched={touched.description}
              />
            </div>

            <div className={styles.buttonGroup}>
              <Button
                type="submit"
                variant="primary"
                disabled={emotionsLoading}
                loading={isSubmitting}
              >
                {isSubmitting ? "Зберігаємо..." : "Зберегти"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
