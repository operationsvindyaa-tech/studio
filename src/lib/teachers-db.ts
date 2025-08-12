
// This is a simple in-memory "database" for demonstration purposes.
// In a real application, you would use a proper database like Firestore, PostgreSQL, etc.

export type Teacher = {
  id: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  classCenter: string;
  noOfBatches: number;
  totalStudents: number;
  noOfWorkingDays: number;
  weekOff: string;
  email: string;
  avatar: string;
  initials: string;
};

const initialTeachers: Teacher[] = [
    { id: "T001", name: "Dr. Evelyn Reed", designation: "Senior Instructor", department: "Academics", phone: "(555) 111-2222", classCenter: "Main Campus", noOfBatches: 4, totalStudents: 80, noOfWorkingDays: 22, weekOff: "Sunday", email: "e.reed@campus.com", avatar: "https://placehold.co/100x100.png", initials: "ER" },
    { id: "T002", name: "Prof. Samuel Jones", designation: "Professor", department: "Science", phone: "(555) 333-4444", classCenter: "Science Wing", noOfBatches: 3, totalStudents: 65, noOfWorkingDays: 22, weekOff: "Sunday", email: "s.jones@campus.com", avatar: "https://placehold.co/100x100.png", initials: "SJ" },
    { id: "T003", name: "Maria Garcia", designation: "Marketing Head", department: "Marketing", phone: "(555) 555-6666", classCenter: "Admin Building", noOfBatches: 0, totalStudents: 0, noOfWorkingDays: 24, weekOff: "Saturday", email: "m.garcia@campus.com", avatar: "https://placehold.co/100x100.png", initials: "MG" },
    { id: "T004", name: "Leo Chen", designation: "Art Director", department: "Arts", phone: "(555) 777-8888", classCenter: "Fine Arts Building", noOfBatches: 5, totalStudents: 50, noOfWorkingDays: 20, weekOff: "Monday", email: "l.chen@campus.com", avatar: "https://placehold.co/100x100.png", initials: "LC" },
    { id: "T005", name: "Priya Sharma", designation: "Dance Guru", department: "Performing Arts", phone: "(555) 222-1111", classCenter: "Dance Studio", noOfBatches: 6, totalStudents: 70, noOfWorkingDays: 22, weekOff: "Tuesday", email: "p.sharma@campus.com", avatar: "https://placehold.co/100x100.png", initials: "PS" },
];

let teachers: Teacher[] = [...initialTeachers];
let nextId = teachers.length + 1;

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getTeachers = async (): Promise<Teacher[]> => {
  await delay(500); // Simulate network latency
  return Promise.resolve(teachers);
};

export type AddTeacherData = Omit<Teacher, 'id' | 'avatar' | 'initials'> & { photo?: string | null };

export const addTeacher = async (teacherData: AddTeacherData): Promise<Teacher> => {
  await delay(500);
  const newId = `T${String(nextId++).padStart(3, '0')}`;
  const newTeacher: Teacher = {
    id: newId,
    name: teacherData.name,
    designation: teacherData.designation,
    department: teacherData.department,
    phone: teacherData.phone,
    classCenter: teacherData.classCenter,
    noOfBatches: teacherData.noOfBatches,
    totalStudents: teacherData.totalStudents,
    noOfWorkingDays: teacherData.noOfWorkingDays,
    weekOff: teacherData.weekOff,
    email: teacherData.email,
    avatar: teacherData.photo || `https://placehold.co/100x100.png`,
    initials: getInitials(teacherData.name),
  };
  teachers.push(newTeacher);
  return Promise.resolve(newTeacher);
};

export const updateTeacher = async (id: string, updates: Partial<AddTeacherData>): Promise<Teacher> => {
    await delay(500);
    const teacherIndex = teachers.findIndex(t => t.id === id);
    if (teacherIndex === -1) {
        throw new Error("Teacher not found");
    }
    const originalTeacher = teachers[teacherIndex];
    const updatedTeacher = {
        ...originalTeacher,
        ...updates,
        name: updates.name || originalTeacher.name,
        designation: updates.designation || originalTeacher.designation,
        department: updates.department || originalTeacher.department,
        phone: updates.phone || originalTeacher.phone,
        classCenter: updates.classCenter || originalTeacher.classCenter,
        noOfBatches: updates.noOfBatches ?? originalTeacher.noOfBatches,
        totalStudents: updates.totalStudents ?? originalTeacher.totalStudents,
        noOfWorkingDays: updates.noOfWorkingDays ?? originalTeacher.noOfWorkingDays,
        weekOff: updates.weekOff || originalTeacher.weekOff,
        email: updates.email || originalTeacher.email,
        initials: updates.name ? getInitials(updates.name) : originalTeacher.initials,
        avatar: updates.photo || originalTeacher.avatar,
    };
    teachers[teacherIndex] = updatedTeacher;
    return Promise.resolve(updatedTeacher);
}

export const deleteTeacher = async (id: string): Promise<{ success: boolean }> => {
    await delay(500);
    const initialLength = teachers.length;
    teachers = teachers.filter(t => t.id !== id);
    if (teachers.length === initialLength) {
         throw new Error("Teacher not found");
    }
    return Promise.resolve({ success: true });
}

export const resetTeachers = () => {
    teachers = [...initialTeachers];
    nextId = teachers.length + 1;
}

    