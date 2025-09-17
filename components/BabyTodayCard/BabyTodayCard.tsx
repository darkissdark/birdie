import css from "./BabyTodayCard.module.css";
import Image from "next/image";
import { getBabyToday } from "@/lib/api/serverApi";

const BabyTodayCard = async () => {
  const babyToday = await getBabyToday();

  if (!babyToday) {
    return (
      <div className={css.card}>
        Помилка завантаження даних, перезавантажте сторінку.
      </div>
    );
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
            sizes="(max-width: 768px) 287px, 257px"
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
          <li className={css.activityItem}>
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
