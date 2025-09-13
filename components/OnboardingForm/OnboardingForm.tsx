"use client";

import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import styles from "./OnboardingForm.module.css";

interface OnboardingFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

// Path to the default SVG avatar icon
const defaultAvatarPath = "/images/icons/avatarImg.svg";

export default function OnboardingForm({
  onSubmit,
  isLoading,
}: OnboardingFormProps) {
  // --- 1. State for form fields ---
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(defaultAvatarPath);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 2. Handler for avatar upload and preview ---
  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreviewUrl(URL.createObjectURL(file));
    } else {
      setAvatarFile(null);
      setAvatarPreviewUrl(defaultAvatarPath);
    }
  };

  // --- 3. Cleanup of the temporary preview URL ---
  useEffect(() => {
    return () => {
      if (avatarPreviewUrl && avatarPreviewUrl !== defaultAvatarPath) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  // --- 4. Form submission handler ---
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("birthDate", birthDate);
    formData.append("gender", gender);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Page title */}
      <h2 className={styles.titleContent}>
        <span>Давайте</span>
        <span>познайомимось</span>
        <span>ближче</span>
      </h2>

      {/* --- Avatar section --- */}
      <div className={styles.avatarSection}>
        <div>
          <Image
            src={avatarPreviewUrl}
            alt="User avatar"
            width={164}
            height={164}
            objectFit="cover"
            className={styles.avatarImage}
          />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          className={styles.uploadButton}
        >
          Завантажити фото
        </button>
      </div>

      {/* --- Form fields --- */}
      <div className={styles.formField}>
        <label htmlFor="gender" className={styles.labelGender}>
          Стать дитини
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className={styles.selectGender}
        >
          <option value="" disabled hidden>
            Оберіть стать
          </option>
          <option value="boy">Хлопчик</option>
          <option value="girl">Дівчинка</option>
          <option value="unknown">Ще не знаю</option>
        </select>
      </div>

      <div className={styles.formField}>
        <label htmlFor="birthDate" className={styles.labelbirthDate}>
          Планова дата пологів
        </label>
        <input
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className={styles.input}
        />
      </div>

      {/* --- Submit button with conditional styles --- */}
      <button
        type="submit"
        className={styles.submitButton}
        data-gender={gender} 
        disabled={!gender || isLoading}
      >
        {isLoading ? "Збереження..." : "Зберегти"}
      </button>
    </form>
  );
}
