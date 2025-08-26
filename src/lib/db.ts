
'use server';

import { query } from './mysql';

export type Student = {
  id: string;
  name: string;
  email: string;
  joined: string; // Should be ISO date string
  status: "Active" | "Inactive" | "Suspended";
  courses: number; // For simplicity, we'll just track the count.
  avatar: string;
  initials: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  fatherName?: string;
  motherName?: string;
  whatsappNumber?: string;
  address?: string;
  desiredCourse?: string;
  enrolledCourses?: string[];
  admissionCenter?: string;
  classMode?: "Online" | "Regular";
};

// --- IMPORTANT ---
// The functions below now query a MySQL database.
// You need to set up your database and create a `students` table.
//
// Example SQL for the `students` table:
/*
CREATE TABLE students (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  joined DATE NOT NULL,
  status ENUM('Active', 'Inactive', 'Suspended') NOT NULL DEFAULT 'Active',
  courses INT DEFAULT 0,
  avatar VARCHAR(255),
  initials VARCHAR(10),
  whatsappNumber VARCHAR(20),
  admissionCenter VARCHAR(255),
  classMode ENUM('Online', 'Regular')
);
*/

const activities = [
    "bharatanatyam", "vocal-carnatic", "guitar", "keyboard", "piano", "drums",
    "violin", "western-dance", "zumba", "gymnastics", "yoga", "karate",
    "kalaripayattu", "art-craft"
];

const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Saanvi", "Aanya", "Aadhya", "Aaradhya", "Anika", "Gia", "Diya", "Pari", "Kiara", "Ananya"];
const lastNames = ["Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Reddy", "Mehta", "Shah", "Jain"];

const generateMockStudents = (): Student[] => {
    const students: Student[] = [];
    let studentIdCounter = 1;

    activities.forEach(activity => {
        for (let i = 0; i < 5; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${firstName} ${lastName}`;
            const student: Student = {
                id: `S${String(studentIdCounter++).padStart(3, '0')}`,
                name: name,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
                joined: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
                status: i % 5 === 4 ? "Inactive" : "Active",
                courses: 1,
                avatar: "https://placehold.co/100x100.png",
                initials: `${firstName[0]}${lastName[0]}`,
                classMode: i % 2 === 0 ? "Regular" : "Online",
                enrolledCourses: [activity],
                desiredCourse: activity,
                whatsappNumber: `9876543${String(studentIdCounter).padStart(3, '0')}`
            };
            students.push(student);
        }
    });

    return students;
};


const mockStudents = generateMockStudents();


export const getStudents = async (): Promise<Student[]> => {
  try {
    const students: any = await query('SELECT * FROM students');
    
    // If query returns null, it means no DB connection, use mock data.
    if (students === null) {
      return mockStudents;
    }
    
    if (!students || students.length === 0) {
        return mockStudents;
    }

    // The database returns dates as objects, so we format them to ISO strings.
    // This is a simplified mapping.
    return students.map((student: any) => ({
      ...student,
      joined: new Date(student.joined).toISOString(),
    }));
  } catch (error) {
    // This catch block is now for actual query errors, not connection errors.
    console.error("Database query failed:", error);
    // Return mock data as a fallback
    return mockStudents;
  }
};

export const addStudent = async (studentData: any) => {
  const initials = studentData.name.split(' ').map((n:string) => n[0]).join('').toUpperCase();

  // Generate a new unique student ID
  const result: any = await query('SELECT id FROM students ORDER BY id DESC LIMIT 1');

  // If there's no DB, we can't add a student.
  if (result === null) {
    console.warn("Cannot add student: No database connection. Operation skipped.");
    // Find the highest ID in mock data to simulate adding
    const lastMockId = mockStudents.reduce((max, s) => {
        const num = parseInt(s.id.replace('S', ''), 10);
        return num > max ? num : max;
    }, 0);
    const newId = `S${String(lastMockId + 1).padStart(3, '0')}`;
    mockStudents.push({
        id: newId,
        name: studentData.name,
        email: studentData.email,
        joined: new Date(studentData.dateOfJoining).toISOString(),
        status: studentData.status,
        courses: 1,
        avatar: studentData.photo || `https://placehold.co/100x100.png`,
        initials: initials,
        classMode: studentData.classMode,
        admissionCenter: studentData.admissionCenter,
    });
    return mockStudents.find(s => s.id === newId);
  }

  let newIdNumber = 1;
  if (result.length > 0) {
    const lastId = result[0].id;
    const lastIdNumber = parseInt(lastId.replace('S', ''), 10);
    newIdNumber = lastIdNumber + 1;
  }
  const studentId = `S${String(newIdNumber).padStart(3, '0')}`;
  
  const sql = `
    INSERT INTO students (id, name, email, joined, status, courses, avatar, initials, classMode, admissionCenter)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  await query(sql, [
    studentId,
    studentData.name,
    studentData.email,
    new Date(studentData.dateOfJoining).toISOString().slice(0, 10), // Format as YYYY-MM-DD
    studentData.status,
    1, // Default courses
    studentData.photo || `https://placehold.co/100x100.png`,
    initials,
    studentData.classMode,
    studentData.admissionCenter,
  ]);

  const newStudent = await query('SELECT * FROM students WHERE id = ?', [studentId]);
  return newStudent;
};

// You would need to implement resetStudents if required for your local setup,
// for example, by running a TRUNCATE TABLE query.
export const resetStudents = async () => {
    // Example: await query('TRUNCATE TABLE students');
    console.log("Resetting students would require a database operation.");
}
