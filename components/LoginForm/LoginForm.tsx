"use client";
import { login, getMe } from "@/lib/api/clientApi";
import useAuthStore from "@/lib/store/authStore";
import { Field, Form, Formik, type FormikHelpers, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import css from "./LoginForm.module.css";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

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
  const setUser = useAuthStore((state) => state.setUser);
  const handleSubmit = async (
    values: LoginValues,
    actions: FormikHelpers<LoginValues>
  ) => {
    try {
      const user = await login(values);
      setUser(user);

      try {
        const fullUserData = await getMe();
        if (fullUserData) {
          setUser(fullUserData);
        }
      } catch (userDataError) {
        console.warn("Could not fetch full user data:", userDataError);
      }

      actions.resetForm();
      router.push("/");
    } catch (error) {
      if ((error as AxiosError).status === 401) {
        toast.error("Логін або пароль не вірний");
      } else {
        toast.error("Щось пішло не так, спробйте пізніше");
      }
    }
  };
  return (
    <div className={css.container}>
      <header className={css.header}>
        <Link href={"/"}>
          <svg width={95} height={30}>
            <use href="#logo-white" />
          </svg>
        </Link>
      </header>
      <div className={css.pageWrapper}>
        <div className={css.formWrapper}>
          <h1 className={css.title}>Вхід</h1>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={Schema}
          >
            {({ isValid, dirty }) => (
              <Form className={css.form}>
                <div className={css.inputBox}>
                  <label htmlFor="email" className={css.label}>
                    Пошта
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="text"
                    className={css.inputField}
                    placeholder="Пошта"
                  />
                  <ErrorMessage name="email">
                    {(msg) => <span className={css.errorMessage}>{msg}</span>}
                  </ErrorMessage>
                </div>

                <div className={css.inputBox}>
                  <label htmlFor="password" className={css.label}>
                    Пароль
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className={css.inputField}
                    placeholder="Пароль"
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
                  Увійти
                </button>
                <p className={css.text}> Немає аккаунту?</p>
                <Link href={"/auth/register"} className={css.link}>
                  Зареєструватися
                </Link>
              </Form>
            )}
          </Formik>
        </div>

        <Image
          src={"/auth/loginFoto.jpg"}
          alt={"login page image"}
          width={720}
          height={900}
          className={css.image}
        />
      </div>
    </div>
  );
};

export default LoginForm;
