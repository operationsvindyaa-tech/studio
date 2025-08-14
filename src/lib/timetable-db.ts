
// This is a simple in-memory "database" for demonstration purposes.
// In a real application, you would use a proper database like Firestore, PostgreSQL, etc.

const initialCenters = [
  "Main Campus (Basavanapura)",
  "Branch 2 (Marathahalli)",
  "Branch 3 (Koramangala)",
  "Branch 4 (Indiranagar)",
  "Branch 5 (Jayanagar)",
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type ScheduleEntry = {
  course: string;
  time: string;
  instructor: string;
};

type TimetableData = {
  [center: string]: {
    [day: string]: {
      [time: string]: ScheduleEntry;
    };
  };
};

const initializeTimetableData = (centers: string[]): TimetableData => {
    const data: TimetableData = {};
    centers.forEach(center => {
        data[center] = {};
        daysOfWeek.forEach(day => {
            data[center][day] = {};
        });
    });
    // Pre-populate some data for demonstration
    if (centers.length > 0) {
        data[centers[0]] = {
            ...data[centers[0]],
            "Monday": { 
                "09:00 AM": { course: "Yoga", time: "09:00 AM", instructor: "Sunita Reddy" },
                "05:00 PM": { course: "Yoga", time: "05:00 PM", instructor: "Sunita Reddy" },
            },
            "Wednesday": { "06:00 PM": { course: "Bharatanatyam", time: "06:00 PM", instructor: "Priya Sharma" } },
            "Friday": { 
                "05:00 PM": { course: "Guitar", time: "05:00 PM", instructor: "Vikram Singh" },
                "06:00 PM": { course: "Guitar", time: "06:00 PM", instructor: "Vikram Singh" },
            },
        };
    }
    return data;
};

export const timetableData = initializeTimetableData(initialCenters);

    