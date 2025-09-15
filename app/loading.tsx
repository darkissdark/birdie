"use client";

import css from "./loading.module.css";

function LoadingMessage() {
  return (
    <div className={css.wrapper}>
      <div className={css.art__circle}></div>
      <div className={css.art}>
        <div className={css.art__head}>
          <div>
            <div className={css.art__eye__wrapper}>
              <div className={css.art__eye}></div>
              <div className={css.art__eye}></div>
            </div>
            <div className={css.art__mouth_helper}>
              <div className={css.art__mouth}></div>
            </div>
            <div className={css.art__leg}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingMessage;
