
// This is a simple in-memory "database" for demonstration purposes.

export type Event = {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: "meeting" | "exam" | "event" | "lecture" | "holiday" | "competition" | "workshop" | "celebration" | "reminder" | "other";
};

const initialEvents: Event[] = [
  { id: "1", title: "Parent-Teacher Meetings", date: new Date("2024-08-15"), time: "9:00 AM - 4:00 PM", type: "meeting" },
  { id: "2", title: "Mid-term Exams Start", date: new Date("2024-08-19"), time: "All Day", type: "exam" },
  { id: "3", title: "Science Fair", date: new Date("2024-08-22"), time: "10:00 AM - 2:00 PM", type: "event" },
  { id: "4", title: "Guest Lecture: AI in Education", date: new Date("2024-08-25"), time: "3:00 PM", type: "lecture" },
];

let events: Event[] = [...initialEvents];

export const getEvents = async (): Promise<Event[]> => {
    // In a real db, this would be an async call
    return Promise.resolve(events);
};

export const updateEvents = (newEvents: Event[]) => {
    events = newEvents;
};
