import { MdOutlineDeleteForever } from "react-icons/md";
import { TbEdit } from "react-icons/tb";

import css from "./DiaryEntryDetails.module.css";

const DiaryEntryDetails = () => {
  return (
    <section className={css.diaryEntryDetails}>
      <div className={css.diaryEntryDetailsWrapper}>
        <div className={css.titleDateBtn}>
          <div className={css.diaryEntryDetailsTitleWrapper}>
            <h2 className={css.diaryEntryDetailsTitle}>Lorem, ipsum</h2>
            <button className={css.diaryEntryDetailsEditBtn}>
              <TbEdit className={css.editBtn} />
            </button>
          </div>
          <div className={css.diaryEntryDetailsDateWrapper}>
            <p className={css.diaryEntryDetailsDate}>12 може 2023.</p>
            <button className={css.diaryEntryDetailsDeleteBtn}>
              <MdOutlineDeleteForever className={css.deleteBtn} />
            </button>
          </div>
        </div>

        <p className={css.diaryEntryDetailsContent}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Temporibus,
          earum omnis harum doloremque voluptates ex, ducimus deserunt doloribus
          maxime ullam suscipit optio quo deleniti exercitationem quibusdam
          sapiente accusamus nihil saepe.
        </p>
        <div>
          <ul className={css.diaryEntryDetailsEmotions}>
            <li className={css.diaryEntryDetailsEmotionsListText}>plakat</li>
            <li className={css.diaryEntryDetailsEmotionsListText}>ridat</li>
            <li className={css.diaryEntryDetailsEmotionsListText}>molitsya</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DiaryEntryDetails;
