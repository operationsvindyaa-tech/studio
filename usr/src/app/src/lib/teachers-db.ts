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
  workingDays: string[];
  email: string;
  avatar: string;
  initials: string;
};

const initialTeachers: Teacher[] = [
    { id: "T001", name: "Dr. Evelyn Reed", designation: "Senior Instructor", department: "Academics", phone: "(555) 111-2222", classCenter: "Main Campus", noOfBatches: 4, totalStudents: 80, noOfWorkingDays: 5, workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], email: "e.reed@campus.com", avatar: "https://placehold.co/100x100.png", initials: "ER" },
    { id: "T002", name: "Prof. Samuel Jones", designation: "Professor", department: "Science", phone: "(555) 333-4444", classCenter: "Science Wing", noOfBatches: 3, totalStudents: 65, noOfWorkingDays: 5, workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], email: "s.jones@campus.com", avatar: "https://placehold.co/100x100.png", initials: "SJ" },
    { id: "T003", name: "Maria Garcia", designation: "Marketing Head", department: "Marketing", phone: "(555) 555-6666", classCenter: "Admin Building", noOfBatches: 0, totalStudents: 0, noOfWorkingDays: 6, workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], email: "m.garcia@campus.com", avatar: "https://placehold.co/100x100.png", initials: "MG" },
    { id: "T004", name: "Leo Chen", designation: "Art Director", department: "Arts", phone: "(555) 777-8888", classCenter: "Fine Arts Building", noOfBatches: 5, totalStudents: 50, noOfWorkingDays: 5, workingDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], email: "l.chen@campus.com", avatar: "https://placehold.co/100x100.png", initials: "LC" },
    { id: "T005", name: "Priya Sharma", designation: "Dance Guru", department: "Performing Arts", phone: "(555) 222-1111", classCenter: "Dance Studio", noOfBatches: 6, totalStudents: 70, noOfWorkingDays: 5, workingDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"], email: "p.sharma@campus.com", avatar: "https://placehold.co/100x100.png", initials: "PS" },
    { id: "T006", name: "Anjali Mehta", designation: "Keyboard Instructor", department: "Academics", phone: "(555) 333-4445", classCenter: "Branch 2 (Marathahalli)", noOfBatches: 4, totalStudents: 45, noOfWorkingDays: 5, workingDays: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"], email: "a.mehta@campus.com", avatar: "https://placehold.co/100x100.png", initials: "AM" },
    { id: "T007", name: "Vikram Singh", designation: "Guitar Teacher", department: "Academics", phone: "(555) 444-5556", classCenter: "Branch 3 (Koramangala)", noOfBatches: 5, totalStudents: 55, noOfWorkingDays: 5, workingDays: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"], email: "v.singh@campus.com", avatar: "https://placehold.co/100x100.png", initials: "VS" },
    { id: "T008", name: "Sunita Reddy", designation: "Yoga Acharya", department: "Wellness", phone: "(555) 555-6667", classCenter: "Main Campus", noOfBatches: 3, totalStudents: 90, noOfWorkingDays: 6, workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], email: "s.reddy@campus.com", avatar: "https://placehold.co/100x100.png", initials: "SR" },
    { id: "T009", name: "Ravi Kumar", designation: "Vocal Carnatic Ustad", department: "Academics", phone: "(555) 222-3334", classCenter: "Main Campus", noOfBatches: 4, totalStudents: 60, noOfWorkingDays: 5, workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"], email: "r.kumar@campus.com", avatar: "https://placehold.co/100x100.png", initials: "RK" },
    { id: "T010", name: "Arjun Desai", designation: "Kalaripayattu Master", department: "Martial Arts", phone: "(555) 666-7778", classCenter: "Branch 4 (Indiranagar)", noOfBatches: 3, totalStudents: 40, noOfWorkingDays: 5, workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], email: "a.desai@campus.com", avatar: "https://placehold.co/100x100.png", initials: "AD" },
    { id: "T011", name: "Meera Iyer", designation: "Admin Head", department: "Administration", phone: "(555) 999-8887", classCenter: "Main Campus", noOfBatches: 0, totalStudents: 0, noOfWorkingDays: 6, workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], email: "m.iyer@campus.com", avatar: "https://placehold.co/100x100.png", initials: "MI" },
    { id: "T012", name: "John Doe", designation: "Western Dance Choreographer", department: "Performing Arts", phone: "(555) 123-4567", classCenter: "Branch 5 (Jayanagar)", noOfBatches: 5, totalStudents: 75, noOfWorkingDays: 5, workingDays: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"], email: "j.doe@campus.com", avatar: "https://placehold.co/100x100.png", initials: "JD" },
    { id: "T013", name: "Jane Smith", designation: "Art & Craft Teacher", department: "Arts", phone: "(555) 234-5678", classCenter: "Branch 2 (Marathahalli)", noOfBatches: 4, totalStudents: 60, noOfWorkingDays: 5, workingDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"], email: "j.smith@campus.com", avatar: "https://placehold.co/100x100.png", initials: "JS" },
    { id: "T014", name: "Robert Brown", designation: "Karate Sensei", department: "Martial Arts", phone: "(555) 345-6789", classCenter: "Main Campus", noOfBatches: 6, totalStudents: 90, noOfWorkingDays: 6, workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], email: "r.brown@campus.com", avatar: "https://placehold.co/100x100.png", initials: "RB" },
    { id: "T015", name: "Emily White", designation: "Zumba Instructor", department: "Wellness", phone: "(555) 456-7890", classCenter: "Branch 3 (Koramangala)", noOfBatches: 7, totalStudents: 100, noOfWorkingDays: 5, workingDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], email: "e.white@campus.com", avatar: "https://placehold.co/100x100.png", initials: "EW" },
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

export const getTeacherById = async (id: string): Promise<Teacher | undefined> => {
    await delay(300);
    return Promise.resolve(teachers.find(t => t.id === id));
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
    workingDays: teacherData.workingDays,
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
        workingDays: updates.workingDays || originalTeacher.workingDays,
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
