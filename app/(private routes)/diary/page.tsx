import css from './DiaryPage.module.css';
import DiaryPageClient from './DiaryPageClient';

const DiaryPage = () => {
  return (
    <section className={css.dairySection}>
      <div className={css.dairyContainer}>
        <DiaryPageClient />
      </div>
    </section>
  );
};

export default DiaryPage;

