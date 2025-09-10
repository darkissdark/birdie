import { notFound } from "next/navigation";

type JourneyPageProps = {
  params: { weekNumber: string };
};

export default async function JourneyPage({ params }: JourneyPageProps) {
  const { weekNumber } = await params;
  const weekNum = Number(weekNumber);

  const MAX_WEEKS_OF_PREGNANCY = 40;
  const MIN_WEEKS_OF_PREGNANCY = 1;

  if (
    !Number.isInteger(weekNum) ||
    weekNum < MIN_WEEKS_OF_PREGNANCY ||
    weekNum > MAX_WEEKS_OF_PREGNANCY
  ) {
    notFound();
  }

  return <div>journeyPage week {weekNum}</div>;
}
