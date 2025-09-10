"use client";
import css from "./RegistrationForm.module.css";
import { register } from "@/lib/api/clientApi";
import useAuthStore from "@/lib/store/authStore";
import { Field, Form, Formik, type FormikHelpers, ErrorMessage } from "formik";
import { ApiError } from "next/dist/server/api-utils";
import Image from "next/image";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";
import * as Yup from "yup";

interface RegistrationValues {
  name: string;
  email: string;
  password: string;
}

const initialValues: RegistrationValues = { name: "", email: "", password: "" };

const Schema = Yup.object().shape({
  name: Yup.string()
    .min(2, "min length 2 symbols")
    .max(20, "max length 20 symbols")
    .required("this field is required"),
  email: Yup.string().email("Некоректний email").required("Обов'язкове поле"),
  password: Yup.string()
    .min(8, "Мінімум 8 символів")
    .required("Обов'язкове поле"),
});

const RegistrationForm = () => {
  const router = useRouter();
  const [error, seterror] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const handleSubmit = async (
    values: RegistrationValues,
    actions: FormikHelpers<RegistrationValues>
  ) => {
    try {
      // const user = await register(values);
      // setUser(user);
      actions.resetForm();
      router.push("/profile/edit");
    } catch (error) {
      seterror((error as ApiError).message);
    }
  };
  return (
    <>
      <h1>Реєстрація</h1>
      <div className={css.pageWrapper}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={Schema}
        >
          {({ isValid, dirty }) => (
            <Form>
              <div>
                <label htmlFor="title">{`Ім'я`}</label>
                <Field id="title" type="text" name="name" />
                <ErrorMessage component="span" name="name" />
              </div>

              <div>
                <label htmlFor="email">Пошта</label>
                <Field id="email" name="email" type="text" />
                <ErrorMessage component="span" name="email" />
              </div>

              <div>
                <label htmlFor="password">Пароль</label>
                <Field id="password" name="password" type="password" />
                <ErrorMessage component="span" name="password" />
              </div>

              <div>
                <button type="submit" disabled={!isValid || !dirty}>
                  Зареєструватись
                </button>
                {error && <p>{error}</p>}
              </div>
              <div>
                Вже маєте акаунт? <Link href={"/auth/login"}>Увійти</Link>
              </div>
            </Form>
          )}
        </Formik>
        <Image
          src={"/regFoto.jpg"}
          alt={"User Avatar"}
          width={720}
          height={900}
        />
      </div>
    </>
  );
};

export default RegistrationForm;
