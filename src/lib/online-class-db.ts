
// This is a simple in-memory "database" for demonstration purposes.

import { addHours, addMinutes, set } from 'date-fns';

export type OnlineClass = {
  id: string;
  courseName: string;
  instructorName: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  meetingLink: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  participants: number;
};

// Helper to create future dates for demo data
const getNextClassTime = (dayOfWeek: number, hour: number, minute: number): Date => {
    const now = new Date();
    const resultDate = new Date(now.getTime());
    resultDate.setDate(now.getDate() + (dayOfWeek + 7 - now.getDay()) % 7);
    resultDate.setHours(hour, minute, 0, 0);
    if (resultDate < now) {
        resultDate.setDate(resultDate.getDate() + 7);
    }
    return resultDate;
};


const initialClasses: OnlineClass[] = [
    {
        id: "OC001",
        courseName: "Advanced Bharatanatyam Theory",
        instructorName: "Dr. Evelyn Reed",
        startTime: getNextClassTime(1, 18, 0).toISOString(), // Next Monday at 6:00 PM
        endTime: addHours(getNextClassTime(1, 18, 0), 1).toISOString(),
        meetingLink: "https://meet.google.com/abc-def-ghi",
        status: "Upcoming",
        participants: 15,
    },
    {
        id: "OC002",
        courseName: "Vocal Carnatic - Gamaka Practice",
        instructorName: "Prof. Samuel Jones",
        startTime: getNextClassTime(3, 17, 30).toISOString(), // Next Wednesday at 5:30 PM
        endTime: addMinutes(getNextClassTime(3, 17, 30), 90).toISOString(),
        meetingLink: "https://meet.google.com/jkl-mno-pqr",
        status: "Upcoming",
        participants: 22,
    },
     {
        id: "OC003",
        courseName: "Guitar - Fingerstyle Techniques",
        instructorName: "Leo Chen",
        startTime: getNextClassTime(5, 19, 0).toISOString(), // Next Friday at 7:00 PM
        endTime: addHours(getNextClassTime(5, 19, 0), 1).toISOString(),
        meetingLink: "https://meet.google.com/stu-vwx-yz",
        status: "Upcoming",
        participants: 18,
    },
];

let onlineClasses: OnlineClass[] = [...initialClasses];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getOnlineClasses = async (): Promise<OnlineClass[]> => {
  await delay(500);
  return Promise.resolve(onlineClasses);
};
