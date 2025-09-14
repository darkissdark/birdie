export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export type HasDueDate = { dueDate?: string | null };

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfUTCDay(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
}

export function getWeekFromDueDate(
  source?: HasDueDate | null,
  today: Date = new Date()
): number {
  const iso = source?.dueDate;
  if (!iso) return 1;

  const due = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(due.getTime())) return 1;

  const todayUTC = startOfUTCDay(today);
  const daysUntilDue = Math.floor(
    (due.getTime() - todayUTC.getTime()) / MS_PER_DAY
  );

  const rawWeek = 40 - Math.floor(daysUntilDue / 7);

  return Math.max(1, Math.min(40, rawWeek));
}
