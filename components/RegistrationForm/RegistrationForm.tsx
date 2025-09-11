"use client";
import css from "./RegistrationForm.module.css";
import { register } from "@/lib/api/clientApi";
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
    .min(2, "Мінімальна довжина 2 символи")
    .max(20, "Максимальна довжина 20 символів")
    .required("Обов'язкове поле"),
  email: Yup.string().email("Некоректний email").required("Обов'язкове поле"),
  password: Yup.string()
    .min(8, "Мінімум 8 символів")
    .required("Обов'язкове поле"),
});

const RegistrationForm = () => {
  const router = useRouter();
  const [error, seterror] = useState("");
  const handleSubmit = async (
    values: RegistrationValues,
    actions: FormikHelpers<RegistrationValues>
  ) => {
    try {
      await register(values);
      actions.resetForm();
      router.push("/profile/edit");
    } catch (error) {
      seterror((error as ApiError).message);
    }
  };
  return (
    <>
      <header>
        <svg></svg>
      </header>
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
