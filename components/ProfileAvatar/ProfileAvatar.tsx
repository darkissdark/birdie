"use client";
import { uploadImage } from "@/lib/api/clientApi";
// import { getMe } from "@/lib/api/clientApi";
import useAuthStore from "@/lib/store/authStore";
import Image from "next/image";
import { useRef } from "react";

export default function ProfileAvatar() {
  const user = useAuthStore((state) => state.user);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // відкриває діалог вибору файлу
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await uploadImage(file);
      console.log("Вибрано файл:", res);
      // тут можна або показати прев’ю, або відправити на сервер
    }
  };

  return (
    <div>
      {user && (
        <>
          <Image
            src={user?.avatarUrl}
            height={132}
            width={132}
            alt="user avatar"
          />
          <p>{user.name}</p>
          <p>{user.email}</p>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button onClick={handleButtonClick}>Завантажити нове фото</button>
        </>
      )}
    </div>
  );
}
