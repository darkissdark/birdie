import css from "./GreetingBlock.module.css";
import { getMe, checkServerSession } from "@/lib/api/serverApi";

export interface WhoTimeProps {
  currentHour: number;
}

function GreetingTime(): WhoTimeProps {
  return { currentHour: new Date().getHours() };
}

const Greeting = async () => {
  try {
    const isAuth = await checkServerSession();
    if (!isAuth?.data?.success) {
      return (
        <div className={css.greetingContainer}>
          <h2 className={css.greetingText}>
            Вітаю! Увійдіть для персоналізації
          </h2>
        </div>
      );
    }

    const user = await getMe();
    const whoTime = GreetingTime();

    let timeGreeting = "Доброго ранку";
    if (whoTime.currentHour >= 12 && whoTime.currentHour < 17)
      timeGreeting = "Доброго дня";
    if (whoTime.currentHour >= 17) timeGreeting = "Доброго вечора";

    return (
      <div className={css.greetingContainer}>
        <h2 className={css.greetingText}>
          {`${timeGreeting}
          ${user.name}`}
        </h2>
      </div>
    );
  } catch {
    return (
      <div className={css.greetingContainer}>
        <h2 className={css.greetingText}>
          Щось пішло не так. Спробуйте перезавантажити сторінку.
        </h2>
      </div>
    );
  }
};

export default Greeting;
