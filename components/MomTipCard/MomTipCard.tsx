"use client";

import css from "./MomTipCard.module.css";
import { useQuery } from "@tanstack/react-query";
import { getMomTip } from "@/lib/api/clientApi";

interface ComfortTip {
  category: string;
  tip: string;
}

const MomTipCard = () => {
  const {
    data: momTip,
    isLoading,
    isError,
  } = useQuery<ComfortTip>({
    queryKey: ["momTip", 1],
    queryFn: () => getMomTip(1),
  });

  if (isLoading) {
    return <div className={css.card}>Завантаження...</div>;
  }

  if (isError || !momTip) {
    return <div className={css.card}>Помилка завантаження даних</div>;
  }
  return (
    <div className={css.card}>
      <h2>Порада для мами</h2>
      <div className={css.descriptionBox}>
        <p>
          <span>{momTip.category}:&nbsp;</span>
          {momTip.tip}
        </p>
      </div>
    </div>
  );
};

export default MomTipCard;

// import css from "./MomTipCard.module.css";

// const MomTipCard = () => {
//   return (
//     <div className={css.card}>
//       <h2>Порада для мами</h2>
//       <div className={css.descriptionBox}>
//         <p>
//           <span>Харчування:&nbsp;</span>
//           Пийте більше води щодня, щоб підтримувати гідратацію та здоровя під
//           час вагітності. Lorem ipsum dolor sit amet consectetur adipisicing
//           elit. Quasi deleniti ullam necessitatibus, porro omnis eveniet
//           molestiae, consequuntur, alias consequatur adipisci assumenda! Fugiat
//           animi repellat accusamus ratione sequi exercitationem in
//           necessitatibus!
//         </p>
//       </div>
//     </div>
//   );
// };

// export default MomTipCard;
