
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

export const getStudents = async (): Promise<Student[]> => {
  // The 'any' type is used here for simplicity. In a real application, you'd
  // want to use a tool like Zod to validate the shape of the data from the DB.
  try {
    const students: any = await query('SELECT * FROM students');
    
    if (!students || students.length === 0) {
        // Return a default student if the database is empty for demo purposes
        return [{
            id: "S001",
            name: "Sample Student",
            email: "sample@example.com",
            joined: new Date().toISOString(),
            status: "Active",
            courses: 1,
            avatar: "https://placehold.co/100x100.png",
            initials: "SS",
            classMode: "Regular",
        }];
    }

    // The database returns dates as objects, so we format them to ISO strings.
    // This is a simplified mapping.
    return students.map((student: any) => ({
      ...student,
      joined: new Date(student.joined).toISOString(),
    }));
  } catch (error) {
    console.error("Database query failed:", error);
    // Return mock data if the database connection fails
    return [{
        id: "S001",
        name: "Sample Student (DB Error)",
        email: "sample@example.com",
        joined: new Date().toISOString(),
        status: "Active",
        courses: 1,
        avatar: "https://placehold.co/100x100.png",
        initials: "SS",
        classMode: "Regular",
    }];
  }
};

export const addStudent = async (studentData: any) => {
  const initials = studentData.name.split(' ').map((n:string) => n[0]).join('').toUpperCase();

  // Generate a new unique student ID
  const result: any = await query('SELECT id FROM students ORDER BY id DESC LIMIT 1');
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
