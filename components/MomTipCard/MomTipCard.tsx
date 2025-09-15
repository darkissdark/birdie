import css from "./MomTipCard.module.css";
import { getMomTip, getMe, getUserStats } from "@/lib/api/serverApi";

const MomTipCard = async () => {
  let isAuthenticated = false;
  try {
    const user = await getMe();
    isAuthenticated = !!user?._id;
  } catch {
    return (
      <div className={css.card}>
        <h2>Порада для мами</h2>
        <div className={css.descriptionBox}>
          <p>
            Не вдалося перевірити авторизацію. Спробуйте перезавантажити
            сторінку.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={css.card}>
        <h2>Порада для мами</h2>
        <div className={css.descriptionBox}>
          <p>
            Підтримуйте гарний настрій, це важливо! Щоб отримувати персональні
            поради для майбутніх мам,
            <span className={css.highlight}>зареєструйтесь</span> на платформі!
          </p>
        </div>
      </div>
    );
  }

  try {
    const { curWeekToPregnant } = await getUserStats();
    const { category, tip } = await getMomTip(curWeekToPregnant);

    return (
      <div className={css.card}>
        <h2>Порада для мами</h2>
        <div className={css.descriptionBox}>
          <p>
            <span>{category}:&nbsp;</span>
            {tip}
          </p>
        </div>
      </div>
    );
  } catch {
    return (
      <div className={css.card}>
        <h2>Порада для мами</h2>
        <div className={css.descriptionBox}>
          <p>Не вдалося завантажити пораду. Спробуйте пізніше.</p>
        </div>
      </div>
    );
  }
};

export default MomTipCard;
