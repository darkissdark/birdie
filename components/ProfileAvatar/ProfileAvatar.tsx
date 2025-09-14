"use client";
import { uploadImage } from "@/lib/api/clientApi";
// import { getMe } from "@/lib/api/clientApi";
import useAuthStore from "@/lib/store/authStore";
import { ApiError } from "next/dist/server/api-utils";
import Image from "next/image";
import { useRef, useState } from "react";

export default function ProfileAvatar() {
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // відкриває діалог вибору файлу
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const updatedUser = await uploadImage(file);
        setUser({
          ...user, // keep old name & email
          ...updatedUser, // overwrite avatarUrl
        });
      } catch (error) {
        setError((error as ApiError).message);
      }
    }
  };

  return (
    <div>
      <>
        <Image
          src={
            user?.avatarUrl ??
            `https://ftp.goit.study/img/common/women-default-avatar.jpg`
          }
          height={132}
          width={132}
          alt="user avatar"
        />
        <p>{user?.name}</p>
        <p>{user?.email}</p>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button onClick={handleButtonClick}>Завантажити нове фото</button>
        {error && <p>{error}</p>}
      </>
    </div>
  );
}
