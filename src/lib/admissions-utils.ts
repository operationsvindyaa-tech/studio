
import { type Student } from "./db";
import { format, getISOWeek, getYear } from 'date-fns';

export type Timeframe = "daily" | "weekly" | "monthly" | "quarterly" | "annually";

type GroupedAdmissions = Record<string, Record<string, number>>;

export const groupAdmissionsByTimeframe = (
  admissions: Student[],
  timeframe: Timeframe
): GroupedAdmissions => {
  const grouped: GroupedAdmissions = {};

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
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `${getYear(date)}-Q${quarter}`;
        break;
      case "annually":
        key = String(getYear(date));
        break;
      default:
        key = format(date, "yyyy-MM-dd");
    }

    if (!grouped[key]) {
      grouped[key] = {};
    }
    
    const center = admission.admissionCenter || "Unknown Center";
    if (!grouped[key][center]) {
        grouped[key][center] = 0;
    }
    grouped[key][center]++;
  });

  return grouped;
};
