"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import OnboardingForm from "../../../components/OnboardingForm/OnboardingForm";
import styles from "./OnboardingPage.module.css";
import Link from "next/link";

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true);
    console.log("Sending form data:", Object.fromEntries(formData.entries()));

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    console.log("Form data submitted successfully!");
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href={"/"}>
          <svg className={styles.logo} width={105} height={45}>
            <use href="/auth/Logo.svg#logo" />
          </svg>
        </Link>
      </header>

      <div className={styles.pageContainer}>
        <div className={styles.formColumn}>
          <OnboardingForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>
        <div className={styles.illustrationColumn}>
          <Image
            src="/images/onboarding/tinySprout.jpg"
            alt="Иллюстрация ростка"
            width={720}
            height={900}
            priority
          />
        </div>
      </div>
    </div>
  );
}
