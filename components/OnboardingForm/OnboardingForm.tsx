"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import styles from "./OnboardingForm.module.css";
import OnboardingAvatar from "../OnboardingAvatar/OnboardingAvatar";
import OnbordingCustomSelect from "../OnbordingCustomSelect/OnbordingCustomSelect";
import useAuthStore from "@/lib/store/authStore";
import { updateUser } from "@/lib/api/clientApi";
import { useState } from "react";
import { ApiError } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

interface OnboardingFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

interface OnborgindFormValues {
  babyGender: string;
  dueDate: string;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const minDate = new Date(today);
minDate.setDate(today.getDate() + 7);

const maxDate = new Date(today);
maxDate.setDate(today.getDate() + 41 * 7);

// --- Validation schema ---
const validationSchema = Yup.object({
  babyGender: Yup.string().oneOf(
    ["boy", "girl", "unknown"],
    "invalid category"
  ),
  dueDate: Yup.date()
    .min(minDate, "Дата має бути не раніше ніж через 1 тиждень")
    .max(maxDate, "Дата має бути не пізніше ніж через 41 тиждень"),
});
const initialValues = { babyGender: "", dueDate: "" };

export default function OnboardingForm({ isLoading }: OnboardingFormProps) {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [error, seterror] = useState("");
  const router = useRouter();
  const handleSubmit = async (
    values: OnborgindFormValues,
    actions: FormikHelpers<OnborgindFormValues>
  ) => {
    try {
      const updatedUser = await updateUser(values);
      setUser({
        ...user,
        ...updatedUser,
      });
      actions.resetForm();
      router.push("/");
    } catch (error) {
      seterror((error as ApiError).message);
    }
  };
  return (
    <>
      {/* Page title */}
      <h2 className={styles.titleContent}>
        <span>Давайте</span>
        <span>познайомимось</span>
        <span>ближче</span>
      </h2>
      <OnboardingAvatar />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange
        validateOnBlur
      >
        {({ isSubmitting, isValid, dirty, values }) => (
          <Form className={styles.form}>
            <div className={styles.formOnboarding}>
              {/* --- Gender field --- */}
              <div className={styles.formField}>
                <div className={styles.selectWrapper}>
                  <OnbordingCustomSelect
                    name="babyGender"
                    label="Стать дитини"
                    options={[
                      { label: "Хлопчик", value: "boy" },
                      { label: "Дівчинка", value: "girl" },
                      { label: "Ще не знаю", value: "unknown" },
                    ]}
                    placeholder="Оберіть стать"
                  />
                </div>
                <ErrorMessage name="babyGender">
                  {(msg) => <span className={styles.errorMessage}>{msg}</span>}
                </ErrorMessage>
              </div>

              {/* --- Birth date field --- */}
              <div className={styles.formField}>
                <label htmlFor="dueDate" className={styles.labelbirthDate}>
                  Планова дата пологів
                </label>
                <Field
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  className={styles.input}
                />
                <ErrorMessage name="dueDate">
                  {(msg) => <span className={styles.errorMessage}>{msg}</span>}
                </ErrorMessage>
              </div>

              {/* --- Submit button --- */}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={!isValid || !dirty}
                data-gender={values.babyGender}
              >
                {isSubmitting || isLoading ? "Збереження..." : "Зберегти"}
              </button>
            </div>

            {error && <p className={styles.apiError}>{error}</p>}
          </Form>
        )}
      </Formik>
    </>
  );
}
