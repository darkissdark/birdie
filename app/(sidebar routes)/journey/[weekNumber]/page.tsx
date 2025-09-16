import { fetchGreeting } from "@/lib/api/serverApi";
import css from "./JourneyPage.module.css";
import WeekSelector from "@/components/WeekSelector/WeekSelector";
import JourneyDetails from "@/components/JourneyDetails/JourneyDetails";
import Greeting from "@/components/GreetingBlock/GreetingBlock";
import { Metadata } from "next";

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
  params: Promise<{ weekNumber?: number[] }>;
};

export default async function Page({ params }: JourneyPageProps) {
  const { weekNumber } = await params;
  const weekParam = Number(weekNumber);
  const greeting = await fetchGreeting();
  const currentWeek = greeting.curWeekToPregnant;
  // const cookieStore = cookies();
  // const token = cookieStore.get("refreshToken");

  // let greeting = null;
  // let currentWeek = 0;

  // if (token) {
  //   greeting = await fetchGreeting();
  //   currentWeek = greeting.curWeekToPregnant;
  // }

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
