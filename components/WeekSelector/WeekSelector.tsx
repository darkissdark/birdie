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

// ======================================================

// 'use client';

// import { useRouter } from 'next/navigation';
// import clsx from 'clsx';
// import { useRef, useEffect } from 'react';
// import css from './WeekSelector.module.css';

// interface WeekSelectorProps {
//   selectedWeek: number;
//   currentWeek: number;
// }

// export default function WeekSelector({
//   selectedWeek,
//   currentWeek,
// }: WeekSelectorProps) {
//   const router = useRouter();
//   const weeks = Array.from({ length: 40 }, (_, i) => i + 1);
//   const buttonRefs = useRef<HTMLButtonElement[]>([]);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const handleClick = (week: number) => {
//     if (week <= currentWeek) {
//       router.push(`/journey/${week}`);
//     }
//   };

//   useEffect(() => {
//     const selectedButton = buttonRefs.current[selectedWeek - 1];
//     if (selectedButton && containerRef.current) {
//       const container = containerRef.current;
//       const buttonLeft = selectedButton.offsetLeft;
//       const buttonWidth = selectedButton.offsetWidth;
//       const containerWidth = container.offsetWidth;

//       container.scrollTo({
//         left: buttonLeft - containerWidth / 2 + buttonWidth / 2,
//         behavior: 'smooth',
//       });
//     }
//   }, [selectedWeek]);

//   return (
//     <div className={css.container} ref={containerRef}>
//       {weeks.map((week, index) => {
//         const isSelected = week === selectedWeek;
//         const isDisabled = week > currentWeek;

//         return (
//           <button
//             key={week}
//             ref={el => {
//               if (el) buttonRefs.current[index] = el;
//             }}
//             className={clsx(
//               css.weekButton,
//               isSelected && css.weekButtonActive,
//               isDisabled && css.weekButtonDisabled
//             )}
//             disabled={isDisabled}
//             onClick={() => handleClick(week)}
//           >
//             <span className={css.weekNumber}>{week}</span>
//             <span className={css.weekLabel}>Тиждень</span>
//           </button>
//         );
//       })}
//     </div>
//   );
// }

//  ==================================================================

// 'use client';

// import { usePathname, useRouter } from 'next/navigation';
// import clsx from 'clsx';
// import css from './WeekSelector.module.css';
// import { useEffect, useRef } from 'react';

// interface WeekSelectorProps {
//   currentWeek: number;
// }

// export default function WeekSelector({ currentWeek }: WeekSelectorProps) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const weeks = Array.from({ length: 40 }, (_, i) => i + 1);
//   const selectedWeek = Number(pathname?.split('/').pop() || currentWeek);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

//   useEffect(() => {
//     const button = buttonRefs.current[selectedWeek - 1];
//     if (button && containerRef.current) {
//       button.scrollIntoView({ behavior: 'smooth', inline: 'center' });
//     }
//   }, [selectedWeek]);

//   const handleClick = (week: number) => {
//     if (week <= currentWeek) {
//       router.push(`/journey/${week}`);
//     }
//   };

//   return (
//     <div className={css.container} ref={containerRef}>
//       {weeks.map((week, index) => {
//         const isSelected = week === selectedWeek;
//         const isDisabled = week > currentWeek;

//         return (
//           <button
//             key={week}
//             ref={el => {
//               buttonRefs.current[index] = el;
//             }}
//             className={clsx(
//               css.weekButton,
//               isDisabled && css.weekButtonDisabled,
//               isSelected && css.weekButtonActive
//             )}
//             disabled={isDisabled}
//             onClick={() => handleClick(week)}
//           >
//             <span className={css.weekNumber}>{week}</span>
//             <span className={css.weekLabel}>Тиждень</span>
//           </button>
//         );
//       })}
//     </div>
//   );
// }
