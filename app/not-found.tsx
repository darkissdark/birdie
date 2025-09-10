// import type { Metadata } from "next";
import css from "./page.module.css";
// import { SITE_NAME, OG_IMAGE, SITE_DOMAIN } from "@/config/metadata";

// const title = SITE_NAME + " - Page not found";
// const description = "Sorry, the page you are looking for does not exist.";

// export const metadata: Metadata = {
//   title,
//   description,
//   openGraph: {
//     title,
//     description,
//     url: SITE_DOMAIN + "/404.html",
//     siteName: SITE_NAME,
//     images: [OG_IMAGE],
//     type: "website",
//   },
// };

function NotFound() {
  return (
    <main className={css.container}>
      <div className={css.main}>
        <h1 className={css.title}>404 - Сторінку не знайдено</h1>
        <p className={css.description}>
          Вибачте, сторінку, яку ви шукаєте, не існує.
        </p>
      </div>
    </main>
  );
}

export default NotFound;
