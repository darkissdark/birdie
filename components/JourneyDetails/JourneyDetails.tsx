"use client";

import { useEffect, useState } from "react";
import css from "./JourneyDetails.module.css";
import Image from "next/image";
import { AboutBaby, AboutMom, fetchBaby, fetchMom } from "@/lib/api/clientApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { TbNorthStar } from "react-icons/tb";
import Icon from "../Icon/Icon";
import TasksReminderCard from "../TasksReminderCard/TasksReminderCard";

interface JourneyDetailsProps {
  weekNumber: number;
}
interface ComfortTip {
  category: string;
  tip: string;
}

export default function JourneyDetails({ weekNumber }: JourneyDetailsProps) {
  const [baby, setBaby] = useState<AboutBaby | null>(null);
  const [mom, setMom] = useState<AboutMom | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [babyData, momData] = await Promise.all([
          fetchBaby(weekNumber),
          fetchMom(weekNumber),
        ]);
        setBaby(babyData);
        setMom(momData);
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
      }
    };

    loadData();
  }, [weekNumber]);
  // ============================================
  // const baby: AboutBaby = {
  //   analogy: "Ваш малюк зараз розміом з Голівку шпильки.",
  //   image: "https://ftp.goit.study/img/lehlehka",
  //   description: ["Крихітна групка клітин, яка називається бластоцистою"],
  //   interestingFact:
  //     "Хоча зародок ще мікроскопічний, він вже містить повний набір ДНК",
  // };
  // const mom: AboutMom = {
  //   feelings: {
  //     states: ["Незмінний стан"],
  //     sensationDescr:
  //       "Запліднена яйцеклітина подорожує до матки. Ви, швидше за все, нічого не відчуєте, хоча деякі жінки стверджують, що інтуїтивно 'знали' про зачаття. Наприкінці тижня ...",
  //   },
  //   comfortTips: [
  //     {
  //       category: "Харчування",
  //       tip: "Дійте так, ніби ви вже вагітні...",
  //     },
  //     {
  //       category: "Відпочинок",
  //       tip: "loren10",
  //     },
  //     {
  //       category: "Активність",
  //       tip: "активность проверка работы иконок",
  //     },
  //   ],
  // };
  // ============================
  const categoryIcons: Record<string, React.ReactElement> = {
    Харчування: <Icon id="tableware_icon" size={24} />,
    Активність: <Icon id="fitness_icon" size={24} />,
    Відпочинок: <Icon id="chair_icon" size={24} />,
  };
  // ========================================
  return (
    <div className={css.journeyDetails}>
      <Tabs defaultValue="tab1">
        <TabsList className={css.tabSelector}>
          <TabsTrigger className={css.tabItem} value="tab1">
            Розвиток малюка
          </TabsTrigger>
          <TabsTrigger className={css.tabItem} value="tab2">
            Тіло мами
          </TabsTrigger>
        </TabsList>
        {/* <div className={css.contentList}> */}
        <TabsContent value="tab1">
          {baby ? (
            <div className={`${css.contentList} ${css.baby}`}>
              <div className={css.babyImage}>
                <Image
                  className={css.babyImg}
                  src={baby.image}
                  alt="Baby"
                  width={287}
                  height={379}
                />
                <p className={css.item}>{baby.analogy}</p>
              </div>
              <div>
                <div className={css.descriptionList}>
                  {baby.description.map((descr: string, index: number) => (
                    <p key={index} className={css.item}>
                      {descr}
                    </p>
                  ))}
                </div>
                <div className={css.fact}>
                  <h2 className={css.title}>
                    <TbNorthStar size={24} />
                    Цікавий факт тижня
                  </h2>
                  <strong className={css.item}>{baby.interestingFact}</strong>
                </div>
              </div>
            </div>
          ) : (
            <p>Завантаження сторінки дитини...</p>
          )}
        </TabsContent>

        <TabsContent value="tab2">
          {mom ? (
            <div className={css.mom}>
              <div className={css.momContent}>
                <div className={`${css.contentList} ${css.feelings}`}>
                  <h3 className={css.title}>Як ви можете почуватись</h3>
                  <ul className={css.feelingsList}>
                    {mom.feelings.states.map((state: string, index: number) => (
                      <li key={index} className={css.feelingsItem}>
                        {state}
                      </li>
                    ))}
                  </ul>
                  <p className={css.item}>{mom.feelings.sensationDescr}</p>
                </div>
                <div className={css.contentList}>
                  <h3 className={css.title}>Поради для вашого комфорту</h3>
                  <ul className={css.tipsList}>
                    {mom.comfortTips.map(
                      (comfortTip: ComfortTip, i: number) => (
                        <li key={i} className={css.tipItem}>
                          <div className={css.iconWrapper}>
                            {categoryIcons[comfortTip.category] ?? null}
                          </div>
                          <div className={css.tipContent}>
                            <strong className={css.tipCategory}>
                              {comfortTip.category}:
                            </strong>
                            <p className={css.item}>{comfortTip.tip}</p>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
              <div className={`${css.contentList} ${css.tasks}`}>
                <TasksReminderCard />
              </div>
            </div>
          ) : (
            <p>Завантаження сторінки мами...</p>
          )}
        </TabsContent>
        {/* </div> */}
      </Tabs>
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import css from './JourneyDetails.module.css';
// import Image from 'next/image';
// import { AboutBaby, AboutMom, fetchBaby, fetchMom } from '@/lib/api/clientApi';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';

// interface JourneyDetailsProps {
//   weekNumber: number;
// }

// export default function JourneyDetails({ weekNumber }: JourneyDetailsProps) {
//   const [baby, setBaby] = useState<AboutBaby | null>(null);
//   const [mom, setMom] = useState<AboutMom | null>(null);

//   useEffect(() => {
//     fetchBaby(weekNumber).then(setBaby).catch(console.error);
//     fetchMom(weekNumber).then(setMom).catch(console.error);
//   }, [weekNumber]);
