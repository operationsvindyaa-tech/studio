// This is a simple in-memory "database" for demonstration purposes.
// In a real application, you would use a proper database like Firestore, PostgreSQL, etc.

export type Teacher = {
  id: string;
  name: string;
  subject: string;
  email: string;
  phone: string;
  avatar: string;
  initials: string;
};

const initialTeachers: Teacher[] = [
    { id: "T001", name: "Dr. Evelyn Reed", subject: "Web Development", email: "e.reed@campus.com", phone: "(555) 111-2222", avatar: "https://placehold.co/100x100.png", initials: "ER" },
    { id: "T002", name: "Prof. Samuel Jones", subject: "Data Science", email: "s.jones@campus.com", phone: "(555) 333-4444", avatar: "https://placehold.co/100x100.png", initials: "SJ" },
    { id: "T003", name: "Maria Garcia", subject: "Digital Marketing", email: "m.garcia@campus.com", phone: "(555) 555-6666", avatar: "https://placehold.co/100x100.png", initials: "MG" },
    { id: "T004", name: "Leo Chen", subject: "Graphic Design", email: "l.chen@campus.com", phone: "(555) 777-8888", avatar: "https://placehold.co/100x100.png", initials: "LC" },
    { id: "T005", name: "Priya Sharma", subject: "Bharatanatyam", email: "p.sharma@campus.com", phone: "(555) 222-1111", avatar: "https://placehold.co/100x100.png", initials: "PS" },
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

export const addTeacher = async (teacherData: Omit<Teacher, 'id' | 'avatar' | 'initials'>): Promise<Teacher> => {
  await delay(500);
  const newId = `T${String(nextId++).padStart(3, '0')}`;
  const newTeacher: Teacher = {
    id: newId,
    ...teacherData,
    avatar: `https://placehold.co/100x100.png`,
    initials: getInitials(teacherData.name),
  };
  teachers.push(newTeacher);
  return Promise.resolve(newTeacher);
};

export const updateTeacher = async (id: string, updates: Partial<Omit<Teacher, 'id' | 'avatar' | 'initials'>>): Promise<Teacher> => {
    await delay(500);
    const teacherIndex = teachers.findIndex(t => t.id === id);
    if (teacherIndex === -1) {
        throw new Error("Teacher not found");
    }
    const originalTeacher = teachers[teacherIndex];
    const updatedTeacher = {
        ...originalTeacher,
        ...updates,
        initials: updates.name ? getInitials(updates.name) : originalTeacher.initials,
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

    