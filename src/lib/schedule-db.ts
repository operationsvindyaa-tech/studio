
// This is a simple in-memory "database" for demonstration purposes.
import { addDays, set } from "date-fns";

export type Event = {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: "meeting" | "exam" | "event" | "lecture" | "holiday" | "competition" | "workshop" | "celebration" | "reminder" | "other";
};

export type ExamEvent = {
  id: string;
  title: string;
  date: string; // ISO String
  time: string;
  type: 'exam';
  activity: string;
  batch: string;
}

const initialEvents: Event[] = [
  { id: "1", title: "Parent-Teacher Meetings", date: new Date("2024-08-15"), time: "9:00 AM - 4:00 PM", type: "meeting" },
  { id: "2", title: "Mid-term Exams Start", date: new Date("2024-08-19"), time: "All Day", type: "exam" },
  { id: "3", title: "Science Fair", date: new Date("2024-08-22"), time: "10:00 AM - 2:00 PM", type: "event" },
  { id: "4", title: "Guest Lecture: AI in Education", date: new Date("2024-08-25"), time: "3:00 PM", type: "lecture" },
];

const initialExamEvents: ExamEvent[] = [
    { id: "EXM01", title: "Annual Theory Exam", date: addDays(new Date(), 30).toISOString(), time: "10:00 AM", type: 'exam', activity: "Bharatanatyam", batch: "Sat, Sun - 10:00 AM" },
    { id: "EXM02", title: "Mid-Term Practical", date: addDays(new Date(), 45).toISOString(), time: "02:00 PM", type: 'exam', activity: "Vocal Carnatic", batch: "Mon, Wed - 6:00 PM" },
    { id: "EXM03", title: "Grade 3 Exam", date: addDays(new Date(), 60).toISOString(), time: "11:00 AM", type: 'exam', activity: "Guitar", batch: "Tue, Thu - 7:00 PM" },
    { id: "EXM04", title: "Belt Grading", date: addDays(new Date(), 20).toISOString(), time: "All Day", type: 'exam', activity: "Yoga", batch: "Mon to Fri - 7:00 AM" },
];


let events: Event[] = [...initialEvents];
let examEvents: ExamEvent[] = [...initialExamEvents];

export const getEvents = async (): Promise<Event[]> => {
    // In a real db, this would be an async call
    return Promise.resolve(events);
};

export const getExamEvents = async (): Promise<ExamEvent[]> => {
    return Promise.resolve(examEvents);
}

export const updateEvents = (newEvents: Event[]) => {
    events = newEvents;
};
