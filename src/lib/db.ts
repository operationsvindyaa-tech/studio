// This is a simple in-memory "database" for demonstration purposes.
// In a real application, you would use a proper database like Firestore, PostgreSQL, etc.

type Student = {
  id: string;
  name: string;
  email: string;
  joined: string; // Should be ISO date string
  status: "Active" | "Inactive" | "Suspended";
  courses: number; // For simplicity, we'll just track the count.
  avatar: string;
  initials: string;
};

// Initial data to populate the store
const initialStudents: Student[] = [
    { id: "S001", name: "Amelia Rodriguez", email: "amelia.r@example.com", joined: new Date("2023-01-15").toISOString(), status: "Active", courses: 5, avatar: "https://placehold.co/100x100/E6C37B/4A4A4A.png", initials: "AR" },
    { id: "S002", name: "Benjamin Carter", email: "ben.c@example.com", joined: new Date("2023-02-20").toISOString(), status: "Active", courses: 3, avatar: "https://placehold.co/100x100/7BB4E6/FFFFFF.png", initials: "BC" },
    { id: "S003", name: "Chloe Nguyen", email: "chloe.n@example.com", joined: new Date("2023-03-10").toISOString(), status: "Inactive", courses: 1, avatar: "https://placehold.co/100x100/F0F4F7/4A4A4A.png", initials: "CN" },
    { id: "S004", name: "David Kim", email: "david.k@example.com", joined: new Date("2023-04-05").toISOString(), status: "Active", courses: 8, avatar: "https://placehold.co/100x100/999999/FFFFFF.png", initials: "DK" },
    { id: "S005", name: "Emily Wang", email: "emily.w@example.com", joined: new Date("2023-05-21").toISOString(), status: "Suspended", courses: 2, avatar: "https://placehold.co/100x100/E6C37B/4A4A4A.png", initials: "EW" },
    { id: "S006", name: "Franklin Garcia", email: "franklin.g@example.com", joined: new Date("2023-06-18").toISOString(), status: "Active", courses: 6, avatar: "https://placehold.co/100x100/7BB4E6/FFFFFF.png", initials: "FG" },
];

let students: Student[] = [...initialStudents];
let nextId = students.length + 1;

export const getStudents = async (): Promise<Student[]> => {
  // In a real db, this would be an async call
  return Promise.resolve(students);
};

export const addStudent = async (studentData: Omit<Student, 'id' | 'courses' | 'avatar' | 'initials' | 'joined'> & { desiredCourse: string, dob: Date, dateOfJoining: Date, email: string }) => {
  const newId = `S${String(nextId++).padStart(3, '0')}`;
  const initials = studentData.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const newStudent: Student = {
    id: newId,
    name: studentData.name,
    email: studentData.email,
    joined: studentData.dateOfJoining.toISOString().split('T')[0],
    status: (studentData as any).status || 'Active', // Admissions form doesn't have status, default to Active
    courses: 1, // Enrolled in one course initially
    avatar: `https://placehold.co/100x100.png`,
    initials: initials,
  };
  students.push(newStudent);
  return Promise.resolve(newStudent);
};

export const resetStudents = () => {
    students = [...initialStudents];
    nextId = students.length + 1;
}
