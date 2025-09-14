"use client";

import useAuthStore from "@/lib/store/authStore";
import { Field, Form, Formik, type FormikHelpers, ErrorMessage } from "formik";
import { ApiError } from "next/dist/server/api-utils";

import { useState } from "react";
import * as Yup from "yup";
import css from "./ProfileEditForm.module.css";
// import Link from "next/link";
// import Image from "next/image";

interface ProfileFormValues {
  name: string;
  email: string;
  babyGender: string;
  dueDate: string;
}

// fix this section myself
const Schema = Yup.object().shape({
  email: Yup.string().email("Некоректний email").required("Обов'язкове поле"), //error message in return section
  password: Yup.string()
    .min(8, "Мінімум 8 символів")
    .required("Обов'язкове поле"),
});

const ProfileEditForm = () => {
  const user = useAuthStore((state) => state.user);
  const initialValues: ProfileFormValues = {
    name: user?.name || "",
    email: user?.email || "",
    babyGender: user?.babyGender || "",
    dueDate: user?.dueDate || "",
  };

  const [error, seterror] = useState("");
  // do the ligc here, request for updating data, set new users and get user from backend and patch - to the backend, receive user, and wrire the user in state.(in store)
  const handleSubmit = async (
    values: ProfileFormValues,
    actions: FormikHelpers<ProfileFormValues>
  ) => {
    try {
      // const user = await login(values);
      // setUser(user);
      actions.resetForm();
      // router.push("/");
      console.log(values);
      console.log(useAuthStore.getState());
    } catch (error) {
      seterror((error as ApiError).message);
    }
  };
  return (
    <div className={css.container}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={Schema}
      >
        {({ isValid, dirty }) => (
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
              <label htmlFor="Email" className={css.label}>
                Пошта
              </label>
              <Field
                id="Email"
                name="Email"
                type="email"
                className={css.inputField}
                placeholder="Пошта"
              />
              <ErrorMessage name="Email">
                {(msg) => <span className={css.errorMessage}>{msg}</span>}
              </ErrorMessage>
            </div>

            {/* change babygender */}

            <div className={css.formGroup}>
              <label htmlFor="gender" className={css.labelGender}>
                Стать дитини
              </label>
              <Field
                as="select"
                id="babyGender"
                name="babyGender"
                className={css.selectGender}
              >
                <option value="boy">Хлопчик</option>
                <option value="girl">Дівчинка</option>
                <option value="unknown">Ще не знаю</option>
              </Field>
              <ErrorMessage name="babyGender">
                {(msg) => <span className={css.errorMessage}>{msg}</span>}
              </ErrorMessage>
            </div>

            {/* edit calendar section  */}
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
              <button
                type="submit"
                disabled={!isValid || !dirty}
                className={css.actionBtn}
              >
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
