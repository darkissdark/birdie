"use client";

import { useRef } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import { Ukrainian } from "flatpickr/dist/l10n/uk.js";
import { BiCalendarHeart } from "react-icons/bi";
import type { DateTimePickerHandle } from "react-flatpickr";
import styles from "./AddTaskDatePicker.module.css";

interface CustomDatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

export default function AddTaskDatePicker({
  value,
  onChange,
  placeholder = "Оберіть дату",
  minDate,
  maxDate,
}: CustomDatePickerProps) {
  const flatpickrRef = useRef<DateTimePickerHandle | null>(null);

  return (
    <div className={styles.container}>
      <Flatpickr
        ref={flatpickrRef}
        value={value}
        onChange={([date]: Date[]) => {
          if (date) onChange(date.toISOString());
        }}
        options={{
          locale: Ukrainian,
          dateFormat: "d.m.Y",
          minDate: minDate || today,
          maxDate: maxDate,
          disableMobile: true,
          showMonths: 1,
          position: "above right",
          onDayCreate: (_, __, ___, dayElem) => {
            if (!dayElem.classList.contains("flatpickr-disabled")) {
              dayElem.style.color = "#000000";
              dayElem.style.opacity = "1";
            }
          },
        }}
        className={styles.input}
        placeholder={placeholder}
      />

      <button
        type="button"
        className={styles.iconButton}
        onClick={() => flatpickrRef.current?.flatpickr?.open()}
      >
        <BiCalendarHeart size={20} color="#383737ff" />
      </button>
    </div>
  );
}
