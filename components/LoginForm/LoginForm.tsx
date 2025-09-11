"use client";
import { login } from "@/lib/api/clientApi";
import useAuthStore from "@/lib/store/authStore";
import { Field, Form, Formik, type FormikHelpers, ErrorMessage } from "formik";
import { ApiError } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

interface LoginValues {
  email: string;
  password: string;
}

const initialValues: LoginValues = { email: "", password: "" };

const Schema = Yup.object().shape({
  email: Yup.string().email("Некоректний email").required("Обов'язкове поле"),
  password: Yup.string()
    .min(8, "Мінімум 8 символів")
    .required("Обов'язкове поле"),
});

const LoginForm = () => {
  const router = useRouter();
  const [error, seterror] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const handleSubmit = async (
    values: LoginValues,
    actions: FormikHelpers<LoginValues>
  ) => {
    try {
      const user = await login(values);
      setUser(user);
      actions.resetForm();
      router.push("/");
      console.log(useAuthStore.getState());
    } catch (error) {
      seterror((error as ApiError).message);
    }
  };
  return (
    <>
      <h1>Вхід</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={Schema}
      >
        {({ isValid, dirty }) => (
          <Form>
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
                Увійти
              </button>
              {error && <p>{error}</p>}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginForm;
