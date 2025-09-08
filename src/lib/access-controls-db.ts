
// This is a simple in-memory "database" for access controls.
// In a real application, you would use a proper database.

export type User = {
    id: string;
    name: string;
    email: string;
};

export type Permission = {
    id: string;
    label: string;
    group: string;
};

export type Role = {
    id: string;
    name: string;
    permissions: string[]; // Array of permission IDs
    users: User[];
};

const navItems = [
  { id: "home", label: "Home" },
  { id: "dashboard", label: "Dashboard" },
];

const studentLifecycleNavItems = [
    { id: "student-attendance", label: "Attendance" },
    { id: "progress-report", label: "Progress" },
    { id: "upcoming-events", label: "Upcoming Events" },
    { id: "exam-updates", label: "Exams Updates" },
    { id: "syllabus", label: "Syllabus" },
    { id: "notes", label: "Notes" },
    { id: "online-class", label: "Online Class" },
    { id: "my-payments", label: "My Payments" },
    { id: "student-merchandise", label: "Merchandise" },
    { id: "login", label: "Student Login" },
];

const administrationNavItems = [
    { id: "enquiries", label: "Enquiries" },
    { id: "activity-demo", label: "Demos" },
    { id: "admissions", label: "Admissions" },
    { id: "students", label: "Students" },
    { id: "alumni", label: "Alumni" },
    { id: "branches", label: "Branches" },
    { id: "batches", label: "Batches" },
    { id: "attendance", label: "Take Attendance" },
    { id: "kmd", label: "KMD" },
];

const academicsNavItems = [
    { id: "courses", label: "Courses" },
    { id: "syllabus", label: "Syllabus" },
    { id: "timetable", label: "Timetable" },
    { id: "exam-students-list", label: "Exam List" },
    { id: "certificates", label: "Certificates" },
    { id: "ptm", label: "PTM" },
    { id: "content-library", label: "Content Library" },
];

const hrNavItems = [
    { id: "teachers", label: "Teachers" },
    { id: "staff", label: "Staff" },
    { id: "teacher-attendance", label: "Teacher Attendance" },
    { id: "staff-attendance", label: "Staff Attendance" },
    { id: "tasks", label: "Tasks" },
    { id: "schedule", label: "Schedule" },
    { id: "letters", label: "Letters" },
    { id: "staff-login", label: "Staff Login" },
];

const financeNavItems = [
    { id: "billing", label: "Payments & Invoices" },
    { id: "payroll", label: "Payroll" },
    { id: "payment-status", label: "Fee Management" },
    { id: "accounts", label: "Financial Reports" },
    { id: "expenses", label: "Expenses" },
    { id: "office-inventory", label: "Office Inventory" },
];

const communicationsNavItems = [
    { id: "announcements-hub", label: "Announcements Hub"},
    { id: "banner-brochure", label: "Banner and Brochure" },
    { id: "feedback", label: "Feedback & Surveys" },
];

const inventoryStoreNavItems = [
    { id: "studio-booking", label: "Studio Booking" },
    { id: "merchandise", label: "Merchandise" },
    { id: "diet-planning", label: "Diet Planning" },
];

const executiveInsightsNavItems = [
    { id: "reports", label: "Financial Reports" },
    { id: "student-enrollment-report", label: "Student Reports" },
    { id: "instructor-staff-report", label: "Instructor Reports" },
    { id: "operations-report", label: "Operations Reports" },
    { id: "marketing-growth-report", label: "Marketing Reports" },
    { id: "strategic-reports", label: "Strategic Reports" },
];

export const availablePermissions: Record<string, { id: string; label: string }[]> = {
    "General": navItems,
    "Student Lifecycle": studentLifecycleNavItems,
    "Administration": administrationNavItems,
    "Academics": academicsNavItems,
    "HR": hrNavItems,
    "Finance": financeNavItems,
    "Communications": communicationsNavItems,
    "Inventory & Store": inventoryStoreNavItems,
    "Executive Insights": executiveInsightsNavItems,
};


const initialRoles: Role[] = [
    {
        id: "admin",
        name: "Administrators",
        permissions: Object.values(availablePermissions).flat().map(p => p.id), // All permissions
        users: [
            { id: "user-1", name: "Admin User", email: "admin@vindyaa.com" },
        ],
    },
    {
        id: "staff",
        name: "Staff",
        permissions: [ "dashboard", "students", "attendance", "schedule" ],
        users: [
            { id: "user-2", name: "Priya Sharma", email: "priya.sharma@example.com" },
            { id: "user-3", name: "Suresh Patil", email: "suresh.patil@example.com" },
        ],
    },
    {
        id: "parents",
        name: "Parents",
        permissions: [ "student-attendance", "progress-report", "upcoming-events", "my-payments" ],
        users: [],
    },
];

let roles: Role[] = [...initialRoles];
let nextRoleId = roles.length + 1;
let nextUserId = 4;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getRoles = async (): Promise<Role[]> => {
    await delay(300);
    return Promise.resolve(roles);
};

export const addRole = async (data: { name: string }): Promise<Role> => {
    await delay(300);
    const newRole: Role = {
        id: `role-${nextRoleId++}`,
        name: data.name,
        permissions: [],
        users: [],
    };
    roles.push(newRole);
    return Promise.resolve(newRole);
};

export const updateRole = async (id: string, updates: Partial<Omit<Role, 'id' | 'users'>>): Promise<Role> => {
    await delay(300);
    const roleIndex = roles.findIndex(r => r.id === id);
    if (roleIndex === -1) throw new Error("Role not found");
    roles[roleIndex] = { ...roles[roleIndex], ...updates };
    return Promise.resolve(roles[roleIndex]);
};

export const deleteRole = async (id: string): Promise<{ success: boolean }> => {
    await delay(300);
    roles = roles.filter(r => r.id !== id);
    return Promise.resolve({ success: true });
};

export const addUserToRole = async (roleId: string, userData: Omit<User, 'id'>): Promise<User> => {
    await delay(300);
    const role = roles.find(r => r.id === roleId);
    if (!role) throw new Error("Role not found");

    const newUser: User = {
        ...userData,
        id: `user-${nextUserId++}`,
    };
    role.users.push(newUser);
    return Promise.resolve(newUser);
};

export const deleteUserFromRole = async (roleId: string, userId: string): Promise<{ success: boolean }> => {
    await delay(300);
    const role = roles.find(r => r.id === roleId);
    if (!role) throw new Error("Role not found");
    role.users = role.users.filter(u => u.id !== userId);
    return Promise.resolve({ success: true });
};
