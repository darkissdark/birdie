import { fetchGreeting } from "@/lib/api/serverApi";
import css from "./JourneyPage.module.css";
import WeekSelector from "@/components/WeekSelector/WeekSelector";
import JourneyDetails from "@/components/JourneyDetails/JourneyDetails";
// import GreetingBlock from "@/components/GreetingBlock/GreetingBlock";

type JourneyPageProps = {
  params: Promise<{ weekNumber?: string[] }>;
};

export default async function Page({ params }: JourneyPageProps) {
  const { weekNumber } = await params;
  const weekParam = Number(weekNumber);
  const greeting = await fetchGreeting();
  const currentWeek = greeting.curWeekToPregnant;
  console.log(currentWeek);

  return (
    <>
      <div className={css.container}>
        {/* <GreetingBlock /> */}
        <WeekSelector currentWeek={currentWeek} selectedWeek={weekParam} />
        <JourneyDetails weekNumber={weekParam} />
      </div>
    </>
  );
}
