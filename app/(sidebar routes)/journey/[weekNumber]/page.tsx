import { fetchGreeting } from "@/lib/api/serverApi";
import css from "./JourneyPage.module.css";
import WeekSelector from "@/components/WeekSelector/WeekSelector";
import JourneyDetails from "@/components/JourneyDetails/JourneyDetails";
import Greeting from "@/components/GreetingBlock/GreetingBlock";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Вагітність. Цікаве.",
  description: "Подорож майбутньої матусі впродовж усього періоду вагітності",
  openGraph: {
    title: "Вагітність. Цікаве.",
    description: "Подорож майбутньої матусі впродовж усього періоду вагітності",
    // url: "https://birdie-kohl.vercel.app/journey/[weekNumber]",
    // images: [
    //   {
    //     url: "/auth/regFoto.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Create Note",
    //   },
    // ],
  },
};

type JourneyPageProps = {
  params: Promise<{ weekNumber: number }>;
};

export default async function Page({ params }: JourneyPageProps) {
  let { weekNumber } = await params;
  const weekParam = Number(weekNumber);
  const greeting = await fetchGreeting();
  const currentWeek = greeting.curWeekToPregnant;

  if (currentWeek < weekNumber) {
    weekNumber = currentWeek;
    redirect(`/journey/${weekNumber}`);
  }

  return (
    <>
      <div className={css.container}>
        <Greeting />
        <WeekSelector currentWeek={currentWeek} selectedWeek={weekParam} />
        <JourneyDetails weekNumber={weekParam} />
      </div>
    </>
  );
}
