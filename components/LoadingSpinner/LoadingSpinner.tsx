"use client";

import css from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "medium" | "large";
}

export default function LoadingSpinner({ 
  message = "Завантаження...", 
  size = "medium" 
}: LoadingSpinnerProps) {
  return (
    <div className={`${css.wrapper} ${css[size]}`}>
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
      {message && <p className={css.message}>{message}</p>}
    </div>
  );
}
