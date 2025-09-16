"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import css from "./WeekSelector.module.css";

interface WeekSelectorProps {
  selectedWeek: number;
  currentWeek: number;
  onSelect?: (week: number) => void;
}

export default function WeekSelector({
  selectedWeek,
  currentWeek,
  onSelect,
}: WeekSelectorProps) {
  const router = useRouter();
  const weeks = Array.from({ length: 40 }, (_, i) => i + 1);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleClick = (week: number) => {
    if (week <= currentWeek) {
      onSelect?.(week);
      router.push(`/journey/${week}`);
    }
  };

  useEffect(() => {
    const index = weeks.findIndex((w) => w === selectedWeek);
    const buttonEl = buttonRefs.current[index];
    const containerEl = containerRef.current;
    if (buttonEl && containerEl) {
      const buttonLeft = buttonEl.offsetLeft;
      const buttonWidth = buttonEl.offsetWidth;
      const containerWidth = containerEl.offsetWidth;
      containerEl.scrollTo({
        left: buttonLeft - containerWidth / 2 + buttonWidth / 2,
        behavior: "smooth",
      });
    }
  }, [selectedWeek, weeks]);

  return (
    <div className={css.container} ref={containerRef}>
      {weeks.map((week, idx) => {
        const isSelected = week === selectedWeek;
        const isDisabled = week > currentWeek;

        return (
          <button
            key={week}
            ref={(el) => {
              buttonRefs.current[idx] = el;
            }}
            className={clsx(
              css.weekButton,
              isSelected && css.weekButtonActive,
              isDisabled && css.weekButtonDisabled
            )}
            disabled={isDisabled}
            onClick={() => handleClick(week)}
          >
            <span className={css.weekNumber}>{week}</span>
            <span className={css.weekLabel}>Тиждень</span>
          </button>
        );
      })}
    </div>
  );
}
