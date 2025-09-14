"use client";

import css from "./BabyTodayCard.module.css";
import Image from "next/image";
import { BabyToday } from "@/types/baby";
import { useQuery } from "@tanstack/react-query";
import { getBabyToday } from "@/lib/api/clientApi";

const BabyTodayCard = () => {
  const {
    data: babyToday,
    isLoading,
    isError,
  } = useQuery<BabyToday>({
    queryKey: ["babyToday"],
    queryFn: getBabyToday,
  });

  if (isLoading) {
    return <div className={css.card}>Завантаження...</div>;
  }

  if (isError || !babyToday) {
    return <div className={css.card}>Помилка завантаження даних</div>;
  }
  return (
    <div className={css.card}>
      <h2 className={css.title}>Малюк сьогодні</h2>
      <div className={css.boxImgAndStats}>
        <div className={css.imageContainer}>
          <Image
            className={css.babyImage}
            src={babyToday.image}
            alt="Baby Today"
            priority
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <ul className={css.statsList}>
          <li>
            <p>
              <span>Розмір:&nbsp;</span>
              {babyToday.babySize} см
            </p>
          </li>
          <li>
            <p>
              <span>Вага:&nbsp;</span>
              {babyToday.babyWeight} г
            </p>
          </li>
          <li>
            <p>
              <span>Активність:&nbsp;</span>
              {babyToday.babyActivity}
            </p>
          </li>
        </ul>
      </div>
      <div className={css.descriptionBox}>
        <p className={css.description}>{babyToday.babyDevelopment}</p>
      </div>
    </div>
  );
};

export default BabyTodayCard;
