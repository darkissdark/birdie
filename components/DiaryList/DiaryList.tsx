import { IoIosAddCircleOutline } from "react-icons/io";
import css from "./DiaryList.module.css";
import DiaryEntryCard from "../DiaryEntryCard/DiaryEntryCard";

const DiaryList = () => {
  const handleClick = () => {};

  return (
    <div className={css.diaryWrapper}>
      {/* <h1>Щоденник</h1> */}
      <div className={css.titleWrapper}>
        <h2 className={css.subtitle}>Ваші записи</h2>

        <div className={css.wrapper} onClick={handleClick}>
          <p className={css.miniSubtitle}>Новий запис</p>
          <IoIosAddCircleOutline className={css.addButton} />
        </div>
      </div>
      <DiaryEntryCard />
    </div>
  );
};

export default DiaryList;
