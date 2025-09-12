"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import OnboardingForm from "../../../components/OnboardingForm/OnboardingForm";
import styles from "./OnboardingPage.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true);
    console.log("Sending form data:", Object.fromEntries(formData.entries()));

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    console.log("Form data submitted successfully!");
    router.push("/my-day");
  };

  return (
    <div
      className={styles.pageContainer}
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <div className={styles.formColumn}>
        <OnboardingForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      </div>
      <div className={styles.illustrationColumn}>
        <Image
          src="/images/onboarding/tinySprout.jpg"
          alt="Иллюстрация ростка"
          width={720}
          height={900}
          // fill
          objectFit="contain"
          className={styles.treeImage}
        />
      </div>
    </div>
  );
}
