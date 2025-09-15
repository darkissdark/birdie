"use client";

import useAuthStore from "@/lib/store/authStore";
import { Field, Form, Formik, type FormikHelpers, ErrorMessage } from "formik";
import { ApiError } from "next/dist/server/api-utils";

import { useState } from "react";
import * as Yup from "yup";
import css from "./ProfileEditForm.module.css";
import CustomSelect from "../CustomSelect/CustomSelect";
import { updateUser } from "@/lib/api/clientApi";

interface ProfileFormValues {
  name: string;
  email: string;
  babyGender: string;
  dueDate: string;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const minDate = new Date(today);
minDate.setDate(today.getDate() + 7);

const maxDate = new Date(today);
maxDate.setDate(today.getDate() + 41 * 7);

const Schema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Мінімальна довжина 2 символи")
    .max(20, "Максимальна довжина 20 символів"),
  email: Yup.string().email("Некоректний email"),
  babyGender: Yup.string().oneOf(["boy", "girl", "unkown"], "invalid category"),
  dueDate: Yup.date()
    .min(minDate, "Дата має бути не раніше ніж через 1 тиждень")
    .max(maxDate, "Дата має бути не пізніше ніж через 41 тиждень"),
});

const ProfileEditForm = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const initialValues: ProfileFormValues = {
    name: user?.name || "",
    email: user?.email || "",
    babyGender: user?.babyGender || "",
    dueDate: user?.dueDate || "",
  };

  const [error, seterror] = useState("");
  const handleSubmit = async (
    values: ProfileFormValues,
    actions: FormikHelpers<ProfileFormValues>
  ) => {
    try {
      const updatedUser = await updateUser(values);
      setUser({
        ...user,
        ...updatedUser,
      });
      actions.resetForm();
    } catch (error) {
      seterror((error as ApiError).message);
    }
  };

  return (
    <div className={css.container}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
        validationSchema={Schema}
        validateOnChange
        validateOnBlur
      >
        {({ isValid, dirty, resetForm }) => (
          <Form className={css.formProfile}>
            <div className={css.formGroup}>
              <label htmlFor="name" className={css.label}>
                Імʼя
              </label>
              <Field
                id="name"
                name="name"
                type="text"
                className={css.inputField}
                placeholder="Імʼя"
              />
              <ErrorMessage name="name">
                {(msg) => <span className={css.errorMessage}>{msg}</span>}
              </ErrorMessage>
            </div>

            <div className={css.formGroup}>
              <label htmlFor="email" className={css.label}>
                Пошта
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                className={css.inputField}
                placeholder="hanna@gmail.com"
              />
              <ErrorMessage name="email">
                {(msg) => <span className={css.errorMessage}>{msg}</span>}
              </ErrorMessage>
            </div>

            <div className={css.formGroup}>
              <CustomSelect
                name="babyGender"
                label="Стать дитини"
                options={[
                  { label: "Хлопчик", value: "boy" },
                  { label: "Дівчинка", value: "girl" },
                  { label: "Ще не знаю", value: "unknown" },
                ]}
                placeholder="Оберіть стать"
              />
              <ErrorMessage name="babyGender">
                {(msg) => <span className={css.errorMessage}>{msg}</span>}
              </ErrorMessage>
            </div>

            <div className={css.formGroup}>
              <label htmlFor="dueDate" className={css.labelbirthDate}>
                Планова дата пологів
              </label>
              <Field
                name="dueDate"
                type="date"
                id="dueDate"
                className={css.dueDate}
              />
              <ErrorMessage name="dueDate">
                {(msg) => <span className={css.errorMessage}>{msg}</span>}
              </ErrorMessage>
            </div>

            <div className={css.formAction}>
              <button onClick={() => resetForm()} className={css.actionBtn}>
                Відминити зміни
              </button>
              <button
                type="submit"
                disabled={!isValid || !dirty}
                className={css.actionBtn}
              >
                Зберігти зміни
              </button>
            </div>
            {error && <p className={css.apiError}>{error}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileEditForm;
