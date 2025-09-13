"use client";
import { DiaryEntry, ApiEmotion, DiaryFormValues } from "@/types/diary";
import { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import styles from "./AddDiaryEntryForm.module.css";
import Button from "@/components/Button/Button";

interface AddDiaryEntryFormProps {
  entry?: DiaryEntry;
  onSuccess: () => void;
  onCancel?: () => void;
}
interface DiarySubmitValues {
  title: string;
  description: string;
  emotions: { _id: string; name: string }[];
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
  const [emotions, setEmotions] = useState<ApiEmotion[]>([]);
  const [emotionsLoading, setEmotionsLoading] = useState(true);
  const [emotionsError, setEmotionsError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initialValues: DiaryFormValues = {
    title: entry?.title || "",
    description: entry?.description || "",
    emotions: entry?.emotions
      ? entry.emotions.map((emotion) =>
          typeof emotion === "string" ? emotion : emotion._id
        )
      : [],
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        setEmotionsLoading(true);
        setEmotionsError(null);

        const response = await axiosInstance.get("/emotions?page=1&limit=18");

        let emotionsData: ApiEmotion[] = [];

        if (Array.isArray(response.data)) {
          emotionsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          emotionsData = response.data.data;
        } else if (
          response.data.emotions &&
          Array.isArray(response.data.emotions)
        ) {
          emotionsData = response.data.emotions;
        } else if (
          response.data.results &&
          Array.isArray(response.data.results)
        ) {
          emotionsData = response.data.results;
        }

        const validEmotions = emotionsData.filter(
          (emotion): emotion is ApiEmotion => {
            return (
              emotion &&
              typeof emotion._id === "string" &&
              emotion._id.length > 0 &&
              (typeof emotion.name === "string" ||
                typeof emotion.title === "string")
            );
          }
        );

        if (validEmotions.length === 0) {
          throw new Error("Отримано некоректні дані емоцій");
        }

        setEmotions(validEmotions);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Помилка завантаження емоцій";

        setEmotionsError(errorMessage);

        const fallbackEmotions: ApiEmotion[] = [
          { _id: "1", name: "Натхнення" },
          { _id: "2", name: "Вдячність" },
          { _id: "3", name: "Тривога" },
          { _id: "4", name: "Дивні бажання" },
          { _id: "5", name: "Нудота" },
        ];

        setEmotions(fallbackEmotions);
      } finally {
        setEmotionsLoading(false);
      }
    };

    fetchEmotions();
  }, []);

  const transformEmotionsForSubmit = (
    selectedEmotionIds: string[]
  ): { _id: string; name: string }[] => {
    return selectedEmotionIds.map((id) => {
      const emotion = emotions.find((e) => e._id === id);
      return {
        _id: id,
        name: emotion?.name || emotion?.title || "Невідомо",
      };
    });
  };

  const handleSubmit = async (
    values: DiaryFormValues,
    { setSubmitting }: FormikHelpers<DiaryFormValues>
  ) => {
    try {
      const submitData: DiarySubmitValues = {
        title: values.title,
        description: values.description,
        emotions: transformEmotionsForSubmit(values.emotions),
      };
      toast.success(
        entry ? "Запис успішно оновлено!" : "Запис успішно створено!"
      );

      onSuccess();
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

  const retryLoadEmotions = async () => {
    setEmotionsError(null);
    setEmotionsLoading(true);

    try {
      const response = await axiosInstance.get("/emotions?page=1&limit=18");
      let emotionsData: ApiEmotion[] = [];

      if (Array.isArray(response.data)) {
        emotionsData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        emotionsData = response.data.data;
      } else if (
        response.data.emotions &&
        Array.isArray(response.data.emotions)
      ) {
        emotionsData = response.data.emotions;
      } else if (
        response.data.results &&
        Array.isArray(response.data.results)
      ) {
        emotionsData = response.data.results;
      }

      const validEmotions = emotionsData.filter(
        (emotion): emotion is ApiEmotion => {
          return (
            emotion &&
            typeof emotion._id === "string" &&
            emotion._id.length > 0 &&
            (typeof emotion.name === "string" ||
              typeof emotion.title === "string")
          );
        }
      );

      setEmotions(validEmotions);
    } catch (retryError: unknown) {
      console.error("Помилка повторного завантаження:", retryError);
      setEmotionsError("Помилка завантаження");

      const fallbackEmotions: ApiEmotion[] = [
        { _id: "1", name: "Натхнення" },
        { _id: "2", name: "Вдячність" },
        { _id: "3", name: "Тривога" },
        { _id: "4", name: "Дивні бажання" },
        { _id: "5", name: "Нудота" },
      ];

      setEmotions(fallbackEmotions);
    } finally {
      setEmotionsLoading(false);
    }
  };

  const getSelectedEmotionsDisplay = (selectedIds: string[]) => {
    if (selectedIds.length === 0)
      return { text: "Оберіть категорію", tags: [] };

    const selectedEmotions = selectedIds
      .map((id) => {
        const emotion = emotions.find((e) => e._id === id);
        return emotion
          ? { id, name: emotion.name || emotion.title || "Без назви" }
          : null;
      })
      .filter(Boolean) as { id: string; name: string }[];

    return {
      text: selectedEmotions.map((e) => e.name).join(", "),
      tags: selectedEmotions,
    };
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

              {emotionsLoading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <span>Завантаження категорій...</span>
                </div>
              ) : emotionsError ? (
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
              ) : emotions.length === 0 ? (
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
                <div className={styles.customSelect} ref={dropdownRef}>
                  <div
                    className={`${styles.selectTrigger} ${
                      isDropdownOpen ? styles.selectTriggerOpen : ""
                    } ${
                      errors.emotions && touched.emotions ? styles.error : ""
                    }`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <div className={styles.selectContent}>
                      {values.emotions.length === 0 ? (
                        <span className={styles.selectPlaceholder}>
                          Оберіть категорію
                        </span>
                      ) : (
                        <div className={styles.selectedTags}>
                          {getSelectedEmotionsDisplay(values.emotions).tags.map(
                            (tag) => (
                              <span key={tag.id} className={styles.selectedTag}>
                                {tag.name}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                    <span
                      className={`${styles.selectArrow} ${
                        isDropdownOpen ? styles.selectArrowOpen : ""
                      }`}
                    >
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.99989 5.20762L1.67164 0.87937C1.50164 0.70937 1.30273 0.62854 1.07489 0.63687C0.847061 0.64521 0.648145 0.73437 0.478145 0.90437C0.308145 1.07437 0.223145 1.27746 0.223145 1.51362C0.223145 1.74979 0.308145 1.95287 0.478145 2.12287L5.39715 7.04187C5.56715 7.21187 5.76806 7.29687 5.99989 7.29687C6.23173 7.29687 6.43264 7.21187 6.60264 7.04187L11.5466 2.09787C11.7166 1.92787 11.8016 1.72896 11.8016 1.50112C11.8016 1.27329 11.7166 1.07437 11.5466 0.90437C11.3766 0.73437 11.1736 0.64937 10.9374 0.64937C10.7012 0.64937 10.4981 0.73437 10.3281 0.90437L5.99989 5.20762Z"
                          fill="black"
                          fillOpacity="0.6"
                        />
                      </svg>
                    </span>
                  </div>

                  {isDropdownOpen && (
                    <div className={styles.selectDropdown}>
                      <div className={styles.selectDropdownInner}>
                        {emotions.map((emotion) => {
                          const isSelected = values.emotions.includes(
                            emotion._id
                          );
                          return (
                            <button
                              key={emotion._id}
                              type="button"
                              className={`${styles.selectOption} ${
                                isSelected ? styles.selectOptionSelected : ""
                              }`}
                              onClick={() => {
                                const newEmotions = isSelected
                                  ? values.emotions.filter(
                                      (id) => id !== emotion._id
                                    )
                                  : [...values.emotions, emotion._id];
                                setFieldValue("emotions", newEmotions);
                              }}
                            >
                              <div className={styles.checkbox}>
                                {isSelected && (
                                  <svg
                                    width="12"
                                    height="10"
                                    viewBox="0 0 12 10"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M1 5L4.5 8.5L11 1"
                                      stroke="white"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span>
                                {emotion.name || emotion.title || "Без назви"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
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
