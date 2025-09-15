import css from "./BabyTodayCard.module.css";
import Image from "next/image";
import { getBabyToday, getMe } from "@/lib/api/serverApi";

const BabyTodayCard = async () => {
  let isAuthenticated = false;

  try {
    const user = await getMe();
    isAuthenticated = !!user?._id; // просто присвоюємо, не оголошуємо заново!
  } catch {
    return (
      <div className={css.card}>
        <h2 className={css.title}>Малюк сьогодні</h2>
        <div className={css.descriptionBox}>
          <p className={css.description}>
            Щось пішло не так підчас перевірки аутентифікації. Спробуйте
            перезавантажити сторінку.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={css.card}>
        <h2 className={css.title}>Малюк сьогодні</h2>
        <div className={css.boxImgAndStats}>
          <div className={css.imageContainer}>
            <Image
              className={css.babyImage}
              src="/img/baby.jpg"
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
                ідеальний!
              </p>
            </li>
            <li>
              <p>
                <span>Вага:&nbsp;</span>
                чудова!
              </p>
            </li>
            <li className={css.activityItem}>
              <p>
                <span>Активність:&nbsp;</span>
                як треба!
              </p>
            </li>
          </ul>
        </div>
        <div className={css.descriptionBox}>
          <p className={css.description}>
            Щоб інформація була більш конкретною, будь ласка, увійдіть до свого
            облікового запису.
          </p>
        </div>
      </div>
    );
  }

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
