import css from "./MomTipCard.module.css";
import {
  getMomTip,
  getUserStats,
  checkServerSession,
} from "@/lib/api/serverApi";

const MomTipCard = async () => {
  try {
    const isAuth = await checkServerSession();
    if (!isAuth?.data?.success) {
      throw new Error("Не авторизований");
    }
  } catch {
    return (
      <div className={css.card}>
        <h2>Порада для мами</h2>
        <div className={css.descriptionBox}>
          <p>
            регулярно відвідувати лікаря-гінеколога та дбати про своє фізичне та
            психологічне здоров&rsquo;я протягом усієї вагітності.! Щоб
            отримувати персональні поради для майбутніх мам,
            <span className={css.highlight}>авторизуйтесь</span> на платформі!
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
