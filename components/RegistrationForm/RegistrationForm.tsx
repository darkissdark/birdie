"use client";
import css from "./RegistrationForm.module.css";
import { register } from "@/lib/api/clientApi";
import { AxiosError } from "axios";
import { Field, Form, Formik, type FormikHelpers, ErrorMessage } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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

  const handleSubmit = async (
    values: RegistrationValues,
    actions: FormikHelpers<RegistrationValues>
  ) => {
    try {
      await register(values);
      actions.resetForm();
      router.push("/profile/edit");
    } catch (error) {
      if ((error as AxiosError).status === 409) {
        toast.error("Email уже використовується");
      } else {
        toast.error("Щось пішло не так, спробйте пізніше");
      }
    }
  };
  return (
    <div className={css.container}>
      <header className={css.header}>
        <Link href={"/"}>
          <svg className={css.logo} width={105} height={45}>
            <use href="#logo-white" />
          </svg>
        </Link>
      </header>

      <div className={css.pageWrapper}>
        <div className={css.formWrapper}>
          <h1 className={css.title}>Реєстрація</h1>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={Schema}
          >
            {({ isValid, dirty }) => (
              <Form className={css.form}>
                <div className={css.inputBox}>
                  <label htmlFor="title" className={css.label}>{`Імʼя*`}</label>
                  <Field
                    id="title"
                    type="text"
                    name="name"
                    className={css.inputField}
                    placeholder="Ваше імʼя"
                  />
                  <ErrorMessage name="name">
                    {(msg) => <span className={css.errorMessage}>{msg}</span>}
                  </ErrorMessage>
                </div>
                <div className={css.inputBox}>
                  <label htmlFor="email" className={css.label}>
                    Пошта*
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="text"
                    className={css.inputField}
                    placeholder="hello@leleka.com"
                  />
                  <ErrorMessage name="email">
                    {(msg) => <span className={css.errorMessage}>{msg}</span>}
                  </ErrorMessage>
                </div>
                <div className={css.inputBox}>
                  <label htmlFor="password" className={css.label}>
                    Пароль*
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className={css.inputField}
                    placeholder="********"
                  />
                  <ErrorMessage name="password">
                    {(msg) => <span className={css.errorMessage}>{msg}</span>}
                  </ErrorMessage>
                </div>
                <button
                  type="submit"
                  disabled={!isValid || !dirty}
                  className={css.submitBtn}
                >
                  Зареєструватись
                </button>
                <p className={css.text}> Вже маєте акаунт?</p>
                <Link href={"/auth/login"} className={css.link}>
                  Увійти
                </Link>
              </Form>
            )}
          </Formik>
        </div>
        <Image
          src={"/auth/regFoto.jpg"}
          alt={"registration page image"}
          width={720}
          height={900}
          className={css.image}
          priority
        />
      </div>
    </div>
  );
};

export default RegistrationForm;
