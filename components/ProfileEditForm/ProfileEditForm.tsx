"use client";

import useAuthStore from "@/lib/store/authStore";
import { Field, Form, Formik, type FormikHelpers, ErrorMessage } from "formik";
import { ApiError } from "next/dist/server/api-utils";

import { useState } from "react";
import * as Yup from "yup";
import css from "./ProfileEditForm.module.css";
import Link from "next/link";
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
          <Form className={css.form}>
            <div className={css.inputBox}>
              <label htmlFor="name" className={css.label}>
                Name
              </label>
              <Field
                id="name"
                name="name"
                type="text"
                className={css.inputField}
                placeholder="Name"
              />
              <ErrorMessage name="name">
                {(msg) => <span className={css.errorMessage}>{msg}</span>}
              </ErrorMessage>
            </div>

            <div className={css.inputBox}>
              <label htmlFor="Email" className={css.label}>
                Email
              </label>
              <Field
                id="Email"
                name="Email"
                type="email"
                className={css.inputField}
                placeholder="Email"
              />
              <ErrorMessage name="Email">
                {(msg) => <span className={css.errorMessage}>{msg}</span>}
              </ErrorMessage>
            </div>

            {/* change babygender */}
            <div className={css.inputBox}>
              <label htmlFor="gender">Gender</label>
              <Field
                as="select"
                id="gender"
                name="gender"
                className={css.select}
              >
                <option value="girl">Girl</option>
                <option value="boy">Boy</option>
                <option value="noidea">Dont know</option>
              </Field>
              <ErrorMessage name="gender">
                {(msg) => <span className={css.errorMessage}>{msg}</span>}
              </ErrorMessage>
            </div>

            {/* edit calendar section  */}
            <div>
              <label htmlFor="date">Choose a date:</label>
              <Field name="date" type="date" />
              <ErrorMessage name="duedate">
                {(msg) => <span className={css.errorMessage}>{msg}</span>}
              </ErrorMessage>
            </div>

            <button
              type="submit"
              disabled={!isValid || !dirty}
              className={css.submitBtn}
            >
              Увійти
            </button>
            {error && <p className={css.apiError}>{error}</p>}
            <p className={css.text}> Немає аккаунту?</p>
            <Link href={"/auth/login"} className={css.link}>
              Зареєструватися
            </Link>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileEditForm;
