
import { type Student } from "./db";
import { format, getISOWeek, getMonth, getQuarter, getYear } from 'date-fns';

export type Timeframe = "daily" | "weekly" | "monthly" | "quarterly" | "annually";

export const groupAdmissionsByTimeframe = (
  admissions: Student[],
  timeframe: Timeframe
): Record<string, number> => {
  const grouped: Record<string, number> = {};

  admissions.forEach(admission => {
    const date = new Date(admission.joined);
    let key: string;

    switch (timeframe) {
      case "daily":
        key = format(date, "yyyy-MM-dd");
        break;
      case "weekly":
        const year = getYear(date);
        const week = getISOWeek(date);
        key = `${year}-W${String(week).padStart(2, '0')}`;
        break;
      case "monthly":
        key = format(date, "yyyy-MM");
        break;
      case "quarterly":
        const quarter = getQuarter(date);
        key = `${getYear(date)}-Q${quarter}`;
        break;
      case "annually":
        key = String(getYear(date));
        break;
      default:
        key = format(date, "yyyy-MM-dd");
    }

    if (!grouped[key]) {
      grouped[key] = 0;
    }
    grouped[key]++;
  });

  return grouped;
};
