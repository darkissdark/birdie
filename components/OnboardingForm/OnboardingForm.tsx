"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./OnboardingForm.module.css";
import OnboardingAvatar from "../OnboardingAvatar/OnboardingAvatar";

interface OnboardingFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

// --- Validation schema ---
const validationSchema = Yup.object({
  gender: Yup.string().required("Оберіть стать дитини"),
  birthDate: Yup.string().required("Вкажіть дату пологів"),
});

export default function OnboardingForm({
  onSubmit,
  isLoading,
}: OnboardingFormProps) {
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
        initialValues={{ gender: "", birthDate: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const formData = new FormData();
          formData.append("gender", values.gender);
          formData.append("birthDate", values.birthDate);
          onSubmit(formData);
        }}
      >
        {({ isSubmitting, values }) => (
          <Form className={styles.form}>
            <div className={styles.formOnboarding}>
              {/* --- Gender field --- */}
              <div className={styles.formField}>
                <label htmlFor="gender" className={styles.labelGender}>
                  Стать дитини
                </label>
                <div className={styles.selectWrapper}>
                  <Field
                    as="select"
                    id="gender"
                    name="gender"
                    className={styles.selectGender}
                  >
                    <option value="" disabled hidden>
                      Оберіть стать
                    </option>
                    <option value="boy">Хлопчик</option>
                    <option value="girl">Дівчинка</option>
                    <option value="unknown">Ще не знаю</option>
                  </Field>
                  <span className={styles.customArrow}></span>
                </div>
                <ErrorMessage
                  name="gender"
                  component="div"
                  className={styles.error}
                />
              </div>

              {/* --- Birth date field --- */}
              <div className={styles.formField}>
                <label htmlFor="birthDate" className={styles.labelbirthDate}>
                  Планова дата пологів
                </label>
                <Field
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  className={styles.input}
                />
                <ErrorMessage
                  name="birthDate"
                  component="div"
                  className={styles.error}
                />
              </div>

              {/* --- Submit button --- */}
              <button
                type="submit"
                className={styles.submitButton}
                data-gender={values.gender}
                disabled={!values.gender || isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? "Збереження..." : "Зберегти"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
