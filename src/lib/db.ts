
// This is a simple in-memory "database" for demonstration purposes.
// In a real application, you would use a proper database like Firestore, PostgreSQL, etc.

export type Student = {
  id: string;
  name: string;
  email: string;
  joined: string; // Should be ISO date string
  status: "Active" | "Inactive" | "Suspended";
  courses: number; // For simplicity, we'll just track the count.
  avatar: string;
  initials: string;
  // Adding more fields from admission form
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

// Initial data to populate the store
const initialStudents: Student[] = [
    { id: "S001", name: "Amelia Rodriguez", email: "amelia.r@example.com", joined: new Date("2023-01-15").toISOString(), status: "Active", courses: 5, avatar: "https://placehold.co/100x100/E6C37B/4A4A4A.png", initials: "AR", desiredCourse: 'bharatanatyam', enrolledCourses: ['bharatanatyam', 'yoga'], whatsappNumber: '9876543210', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Regular' },
    { id: "S002", name: "Benjamin Carter", email: "ben.c@example.com", joined: new Date("2023-02-20").toISOString(), status: "Active", courses: 3, avatar: "https://placehold.co/100x100/7BB4E6/FFFFFF.png", initials: "BC", desiredCourse: 'vocal-carnatic', enrolledCourses: ['vocal-carnatic'], whatsappNumber: '9876543211', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Online' },
    { id: "S003", name: "Chloe Nguyen", email: "chloe.n@example.com", joined: new Date("2023-03-10").toISOString(), status: "Inactive", courses: 1, avatar: "https://placehold.co/100x100/F0F4F7/4A4A4A.png", initials: "CN", desiredCourse: 'guitar', enrolledCourses: ['guitar', 'western-dance'], whatsappNumber: '9876543212', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Regular' },
    { id: "S004", name: "David Kim", email: "david.k@example.com", joined: new Date("2023-04-05").toISOString(), status: "Active", courses: 8, avatar: "https://placehold.co/100x100/999999/FFFFFF.png", initials: "DK", desiredCourse: 'keyboard-piano', enrolledCourses: ['keyboard-piano'], whatsappNumber: '9876543213', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Regular' },
    { id: "S005", name: "Emily Wang", email: "emily.w@example.com", joined: new Date("2023-05-21").toISOString(), status: "Suspended", courses: 2, avatar: "https://placehold.co/100x100/E6C37B/4A4A4A.png", initials: "EW", desiredCourse: 'yoga', enrolledCourses: ['yoga'], whatsappNumber: '9876543214', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Online' },
    { id: "S006", name: "Franklin Garcia", email: "franklin.g@example.com", joined: new Date("2023-06-18").toISOString(), status: "Active", courses: 6, avatar: "https://placehold.co/100x100/7BB4E6/FFFFFF.png", initials: "FG", desiredCourse: 'western-dance', enrolledCourses: ['western-dance'], whatsappNumber: '9876543215', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Regular' },
    { id: "S007", name: "Grace Hall", email: "grace.h@example.com", joined: new Date("2023-07-01").toISOString(), status: "Active", courses: 2, avatar: "https://placehold.co/100x100.png", initials: "GH", desiredCourse: 'art-craft', enrolledCourses: ['art-craft'], whatsappNumber: '9876543216', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Regular' },
    { id: "S008", name: "Henry Adams", email: "henry.a@example.com", joined: new Date("2023-07-15").toISOString(), status: "Active", courses: 4, avatar: "https://placehold.co/100x100.png", initials: "HA", desiredCourse: 'karate', enrolledCourses: ['karate'], whatsappNumber: '9876543217', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Regular' },
    { id: "S009", name: "Isabella Martinez", email: "isabella.m@example.com", joined: new Date("2023-08-02").toISOString(), status: "Inactive", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "IM", desiredCourse: 'zumba', enrolledCourses: ['zumba'], whatsappNumber: '9876543218', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Online' },
    { id: "S010", name: "Jack Wilson", email: "jack.w@example.com", joined: new Date("2023-08-20").toISOString(), status: "Active", courses: 3, avatar: "https://placehold.co/100x100.png", initials: "JW", desiredCourse: 'gymnastics', enrolledCourses: ['gymnastics'], whatsappNumber: '9876543219', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Regular' },
    { id: "S011", name: "Katherine Lee", email: "katherine.l@example.com", joined: new Date("2023-09-05").toISOString(), status: "Active", courses: 2, avatar: "https://placehold.co/100x100.png", initials: "KL", desiredCourse: 'vocal-carnatic', enrolledCourses: ['vocal-carnatic', 'keyboard-piano'], whatsappNumber: '9876543220', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Online' },
    { id: "S012", name: "Liam Scott", email: "liam.s@example.com", joined: new Date("2023-09-18").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "LS", desiredCourse: 'guitar', enrolledCourses: ['guitar'], whatsappNumber: '9876543221', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Regular' },
    { id: "S013", name: "Mia Perez", email: "mia.p@example.com", joined: new Date("2023-10-01").toISOString(), status: "Active", courses: 3, avatar: "https://placehold.co/100x100.png", initials: "MP", desiredCourse: 'bharatanatyam', enrolledCourses: ['bharatanatyam'], whatsappNumber: '9876543222', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Regular' },
    { id: "S014", name: "Noah Green", email: "noah.g@example.com", joined: new Date("2023-10-12").toISOString(), status: "Suspended", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "NG", desiredCourse: 'karate', enrolledCourses: ['karate'], whatsappNumber: '9876543223', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Regular' },
    { id: "S015", name: "Olivia King", email: "olivia.k@example.com", joined: new Date("2023-11-03").toISOString(), status: "Active", courses: 2, avatar: "https://placehold.co/100x100.png", initials: "OK", desiredCourse: 'western-dance', enrolledCourses: ['western-dance', 'zumba'], whatsappNumber: '9876543224', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Online' },
    { id: "S016", name: "Penelope Wright", email: "penelope.w@example.com", joined: new Date("2023-11-15").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "PW", desiredCourse: 'yoga', enrolledCourses: ['yoga'], whatsappNumber: '9876543225', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Online' },
    { id: "S017", name: "Quinn Harris", email: "quinn.h@example.com", joined: new Date("2023-12-01").toISOString(), status: "Active", courses: 2, avatar: "https://placehold.co/100x100.png", initials: "QH", desiredCourse: 'art-craft', enrolledCourses: ['art-craft'], whatsappNumber: '9876543226', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Regular' },
    { id: "S018", name: "Ryan Clark", email: "ryan.c@example.com", joined: new Date("2024-01-10").toISOString(), status: "Active", courses: 3, avatar: "https://placehold.co/100x100.png", initials: "RC", desiredCourse: 'kalaripayattu', enrolledCourses: ['kalaripayattu'], whatsappNumber: '9876543227', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Regular' },
    { id: "S019", name: "Sophia Lewis", email: "sophia.l@example.com", joined: new Date("2024-01-22").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "SL", desiredCourse: 'gymnastics', enrolledCourses: ['gymnastics'], whatsappNumber: '9876543228', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Regular' },
    { id: "S020", name: "Thomas Walker", email: "thomas.w@example.com", joined: new Date("2024-02-05").toISOString(), status: "Active", courses: 2, avatar: "https://placehold.co/100x100.png", initials: "TW", desiredCourse: 'guitar', enrolledCourses: ['guitar'], whatsappNumber: '9876543229', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Regular' },
    { id: "S021", name: "Uma Patel", email: "uma.p@example.com", joined: new Date("2024-02-19").toISOString(), status: "Inactive", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "UP", desiredCourse: 'vocal-carnatic', enrolledCourses: ['vocal-carnatic'], whatsappNumber: '9876543230', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Online' },
    { id: "S022", name: "Victoria Hall", email: "victoria.h@example.com", joined: new Date("2024-03-04").toISOString(), status: "Active", courses: 3, avatar: "https://placehold.co/100x100.png", initials: "VH", desiredCourse: 'bharatanatyam', enrolledCourses: ['bharatanatyam'], whatsappNumber: '9876543231', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Regular' },
    { id: "S023", name: "William Young", email: "william.y@example.com", joined: new Date("2024-03-18").toISOString(), status: "Active", courses: 2, avatar: "https://placehold.co/100x100.png", initials: "WY", desiredCourse: 'keyboard-piano', enrolledCourses: ['keyboard-piano'], whatsappNumber: '9876543232', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Regular' },
    { id: "S024", name: "Xavier Hernandez", email: "xavier.h@example.com", joined: new Date("2024-04-01").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "XH", desiredCourse: 'karate', enrolledCourses: ['karate'], whatsappNumber: '9876543233', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Regular' },
    { id: "S025", name: "Yara Ibrahim", email: "yara.i@example.com", joined: new Date("2024-04-15").toISOString(), status: "Active", courses: 2, avatar: "https://placehold.co/100x100.png", initials: "YI", desiredCourse: 'yoga', enrolledCourses: ['yoga', 'art-craft'], whatsappNumber: '9876543234', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Online' },
    { id: "S026", name: "Zane Roberts", email: "zane.r@example.com", joined: new Date("2024-05-01").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "ZR", desiredCourse: 'karate', enrolledCourses: ['karate'], whatsappNumber: '9876543235', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Regular' },
    { id: "S027", name: "Ava Chen", email: "ava.c@example.com", joined: new Date("2024-05-03").toISOString(), status: "Active", courses: 2, avatar: "https://placehold.co/100x100.png", initials: "AC", desiredCourse: 'zumba', enrolledCourses: ['zumba', 'yoga'], whatsappNumber: '9876543236', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Online' },
    { id: "S028", name: "Leo Kim", email: "leo.k@example.com", joined: new Date("2024-05-05").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "LK", desiredCourse: 'gymnastics', enrolledCourses: ['gymnastics'], whatsappNumber: '9876543237', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Regular' },
    { id: "S029", name: "Mia Johnson", email: "mia.j@example.com", joined: new Date("2024-05-08").toISOString(), status: "Inactive", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "MJ", desiredCourse: 'art-craft', enrolledCourses: ['art-craft'], whatsappNumber: '9876543238', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Regular' },
    { id: "S030", name: "Noah Williams", email: "noah.w@example.com", joined: new Date("2024-05-10").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "NW", desiredCourse: 'kalaripayattu', enrolledCourses: ['kalaripayattu'], whatsappNumber: '9876543239', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Regular' },
    { id: "S031", name: "Oliver Brown", email: "oliver.b@example.com", joined: new Date("2024-05-12").toISOString(), status: "Active", courses: 2, avatar: "https://placehold.co/100x100.png", initials: "OB", desiredCourse: 'guitar', enrolledCourses: ['guitar', 'keyboard-piano'], whatsappNumber: '9876543240', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Regular' },
    { id: "S032", name: "Luna Garcia", email: "luna.g@example.com", joined: new Date("2024-05-15").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "LG", desiredCourse: 'western-dance', enrolledCourses: ['western-dance'], whatsappNumber: '9876543241', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Online' },
    { id: "S033", name: "Ezra Miller", email: "ezra.m@example.com", joined: new Date("2024-05-18").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "EM", desiredCourse: 'vocal-carnatic', enrolledCourses: ['vocal-carnatic'], whatsappNumber: '9876543242', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Online' },
    { id: "S034", name: "Aurora Davis", email: "aurora.d@example.com", joined: new Date("2024-05-20").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "AD", desiredCourse: 'bharatanatyam', enrolledCourses: ['bharatanatyam'], whatsappNumber: '9876543243', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Regular' },
    { id: "S035", name: "Silas Rodriguez", email: "silas.r@example.com", joined: new Date("2024-05-22").toISOString(), status: "Suspended", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "SR", desiredCourse: 'karate', enrolledCourses: ['karate'], whatsappNumber: '9876543244', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Regular' },
    { id: "S036", name: "Nova Martinez", email: "nova.m@example.com", joined: new Date("2024-05-25").toISOString(), status: "Active", courses: 2, avatar: "https://placehold.co/100x100.png", initials: "NM", desiredCourse: 'yoga', enrolledCourses: ['yoga', 'zumba'], whatsappNumber: '9876543245', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Online' },
    { id: "S037", name: "Axel Hernandez", email: "axel.h@example.com", joined: new Date("2024-05-28").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "AH", desiredCourse: 'gymnastics', enrolledCourses: ['gymnastics'], whatsappNumber: '9876543246', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Regular' },
    { id: "S038", name: "Isla Lopez", email: "isla.l@example.com", joined: new Date("2024-06-01").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "IL", desiredCourse: 'art-craft', enrolledCourses: ['art-craft'], whatsappNumber: '9876543247', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Regular' },
    { id: "S039", name: "Mateo Wilson", email: "mateo.w@example.com", joined: new Date("2024-06-03").toISOString(), status: "Inactive", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "MW", desiredCourse: 'kalaripayattu', enrolledCourses: ['kalaripayattu'], whatsappNumber: '9876543248', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Regular' },
    { id: "S040", name: "Aria Moore", email: "aria.m@example.com", joined: new Date("2024-06-05").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "AM", desiredCourse: 'guitar', enrolledCourses: ['guitar'], whatsappNumber: '9876543249', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Regular' },
    { id: "S041", name: "Elias Taylor", email: "elias.t@example.com", joined: new Date("2024-06-08").toISOString(), status: "Active", courses: 2, avatar: "https://placehold.co/100x100.png", initials: "ET", desiredCourse: 'keyboard-piano', enrolledCourses: ['keyboard-piano', 'vocal-carnatic'], whatsappNumber: '9876543250', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Online' },
    { id: "S042", name: "Mila Anderson", email: "mila.a@example.com", joined: new Date("2024-06-10").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "MA", desiredCourse: 'western-dance', enrolledCourses: ['western-dance'], whatsappNumber: '9876543251', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Online' },
    { id: "S043", name: "Kai Thomas", email: "kai.t@example.com", joined: new Date("2024-06-12").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "KT", desiredCourse: 'bharatanatyam', enrolledCourses: ['bharatanatyam'], whatsappNumber: '9876543252', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Regular' },
    { id: "S044", name: "Eliana Jackson", email: "eliana.j@example.com", joined: new Date("2024-06-15").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "EJ", desiredCourse: 'karate', enrolledCourses: ['karate'], whatsappNumber: '9876543253', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Regular' },
    { id: "S045", name: "Josiah White", email: "josiah.w@example.com", joined: new Date("2024-06-18").toISOString(), status: "Active", courses: 2, avatar: "https://placehold.co/100x100.png", initials: "JW", desiredCourse: 'yoga', enrolledCourses: ['yoga', 'art-craft'], whatsappNumber: '9876543254', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Online' },
    { id: "S046", name: "Leilani Harris", email: "leilani.h@example.com", joined: new Date("2024-06-20").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "LH", desiredCourse: 'zumba', enrolledCourses: ['zumba'], whatsappNumber: '9876543255', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Online' },
    { id: "S047", name: "Grayson Martin", email: "grayson.m@example.com", joined: new Date("2024-06-22").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "GM", desiredCourse: 'gymnastics', enrolledCourses: ['gymnastics'], whatsappNumber: '9876543256', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Regular' },
    { id: "S048", name: "Adalynn Thompson", email: "adalynn.t@example.com", joined: new Date("2024-06-25").toISOString(), status: "Inactive", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "AT", desiredCourse: 'kalaripayattu', enrolledCourses: ['kalaripayattu'], whatsappNumber: '9876543257', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Regular' },
    { id: "S049", name: "Rowan Robinson", email: "rowan.r@example.com", joined: new Date("2024-06-28").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "RR", desiredCourse: 'guitar', enrolledCourses: ['guitar'], whatsappNumber: '9876543258', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Regular' },
    { id: "S050", name: "Amara Clark", email: "amara.c@example.com", joined: new Date("2024-07-01").toISOString(), status: "Active", courses: 2, avatar: "https://placehold.co/100x100.png", initials: "AC", desiredCourse: 'vocal-carnatic', enrolledCourses: ['vocal-carnatic', 'bharatanatyam'], whatsappNumber: '9876543259', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Regular' },
    // Bharatanatyam
    { id: "S051", name: "Aarav Sharma", email: "aarav.s@example.com", joined: new Date("2024-07-02").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "AS", desiredCourse: 'bharatanatyam', enrolledCourses: ['bharatanatyam'], whatsappNumber: '9876543260', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Regular' },
    { id: "S052", name: "Diya Patel", email: "diya.p@example.com", joined: new Date("2024-07-03").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "DP", desiredCourse: 'bharatanatyam', enrolledCourses: ['bharatanatyam'], whatsappNumber: '9876543261', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Regular' },
    { id: "S053", name: "Ishaan Iyer", email: "ishaan.i@example.com", joined: new Date("2024-07-04").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "II", desiredCourse: 'bharatanatyam', enrolledCourses: ['bharatanatyam'], whatsappNumber: '9876543262', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Online' },
    // Vocal Carnatic
    { id: "S054", name: "Myra Reddy", email: "myra.r@example.com", joined: new Date("2024-07-05").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "MR", desiredCourse: 'vocal-carnatic', enrolledCourses: ['vocal-carnatic'], whatsappNumber: '9876543263', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Online' },
    { id: "S055", name: "Vihaan Kumar", email: "vihaan.k@example.com", joined: new Date("2024-07-06").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "VK", desiredCourse: 'vocal-carnatic', enrolledCourses: ['vocal-carnatic'], whatsappNumber: '9876543264', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Online' },
    { id: "S056", name: "Anika Singh", email: "anika.s@example.com", joined: new Date("2024-07-07").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "AS", desiredCourse: 'vocal-carnatic', enrolledCourses: ['vocal-carnatic'], whatsappNumber: '9876543265', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Online' },
    // Guitar
    { id: "S057", name: "Kabir Gupta", email: "kabir.g@example.com", joined: new Date("2024-07-08").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "KG", desiredCourse: 'guitar', enrolledCourses: ['guitar'], whatsappNumber: '9876543266', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Regular' },
    { id: "S058", name: "Saanvi Shah", email: "saanvi.s@example.com", joined: new Date("2024-07-09").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "SS", desiredCourse: 'guitar', enrolledCourses: ['guitar'], whatsappNumber: '9876543267', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Regular' },
    { id: "S059", name: "Advik Das", email: "advik.d@example.com", joined: new Date("2024-07-10").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "AD", desiredCourse: 'guitar', enrolledCourses: ['guitar'], whatsappNumber: '9876543268', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Regular' },
    // Keyboard/Piano
    { id: "S060", name: "Zara Ali", email: "zara.a@example.com", joined: new Date("2024-07-11").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "ZA", desiredCourse: 'keyboard-piano', enrolledCourses: ['keyboard-piano'], whatsappNumber: '9876543269', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Online' },
    { id: "S061", name: "Ayaan Khan", email: "ayaan.k@example.com", joined: new Date("2024-07-12").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "AK", desiredCourse: 'keyboard-piano', enrolledCourses: ['keyboard-piano'], whatsappNumber: '9876543270', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Regular' },
    { id: "S062", name: "Kiara Menon", email: "kiara.m@example.com", joined: new Date("2024-07-13").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "KM", desiredCourse: 'keyboard-piano', enrolledCourses: ['keyboard-piano'], whatsappNumber: '9876543271', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Regular' },
    // Yoga
    { id: "S063", name: "Rohan Joshi", email: "rohan.j@example.com", joined: new Date("2024-07-14").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "RJ", desiredCourse: 'yoga', enrolledCourses: ['yoga'], whatsappNumber: '9876543272', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Online' },
    { id: "S064", name: "Pari Verma", email: "pari.v@example.com", joined: new Date("2024-07-15").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "PV", desiredCourse: 'yoga', enrolledCourses: ['yoga'], whatsappNumber: '9876543273', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Online' },
    { id: "S065", name: "Arjun Nair", email: "arjun.n@example.com", joined: new Date("2024-07-16").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "AN", desiredCourse: 'yoga', enrolledCourses: ['yoga'], whatsappNumber: '9876543274', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Online' },
    // Western Dance
    { id: "S066", name: "Eva DSouza", email: "eva.d@example.com", joined: new Date("2024-07-17").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "ED", desiredCourse: 'western-dance', enrolledCourses: ['western-dance'], whatsappNumber: '9876543275', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Regular' },
    { id: "S067", name: "Vivaan Roy", email: "vivaan.r@example.com", joined: new Date("2024-07-18").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "VR", desiredCourse: 'western-dance', enrolledCourses: ['western-dance'], whatsappNumber: '9876543276', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Regular' },
    { id: "S068", name: "Shanaya Kapoor", email: "shanaya.k@example.com", joined: new Date("2024-07-19").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "SK", desiredCourse: 'western-dance', enrolledCourses: ['western-dance'], whatsappNumber: '9876543277', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Regular' },
    // Art & Craft
    { id: "S069", name: "Aisha Begum", email: "aisha.b@example.com", joined: new Date("2024-07-20").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "AB", desiredCourse: 'art-craft', enrolledCourses: ['art-craft'], whatsappNumber: '9876543278', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Regular' },
    { id: "S070", name: "Neil Bhatt", email: "neil.b@example.com", joined: new Date("2024-07-21").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "NB", desiredCourse: 'art-craft', enrolledCourses: ['art-craft'], whatsappNumber: '9876543279', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Regular' },
    { id: "S071", name: "Rhea Chawla", email: "rhea.c@example.com", joined: new Date("2024-07-22").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "RC", desiredCourse: 'art-craft', enrolledCourses: ['art-craft'], whatsappNumber: '9876543280', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Regular' },
    // Karate
    { id: "S072", name: "Samir Jain", email: "samir.j@example.com", joined: new Date("2024-07-23").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "SJ", desiredCourse: 'karate', enrolledCourses: ['karate'], whatsappNumber: '9876543281', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Regular' },
    { id: "S073", name: "Tara Khanna", email: "tara.k@example.com", joined: new Date("2024-07-24").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "TK", desiredCourse: 'karate', enrolledCourses: ['karate'], whatsappNumber: '9876543282', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Regular' },
    { id: "S074", name: "Yash Mathur", email: "yash.m@example.com", joined: new Date("2024-07-25").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "YM", desiredCourse: 'karate', enrolledCourses: ['karate'], whatsappNumber: '9876543283', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Regular' },
    // Kalaripayattu
    { id: "S075", name: "Aditi Pillai", email: "aditi.p@example.com", joined: new Date("2024-07-26").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "AP", desiredCourse: 'kalaripayattu', enrolledCourses: ['kalaripayattu'], whatsappNumber: '9876543284', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Regular' },
    { id: "S076", name: "Dhruv Menon", email: "dhruv.m@example.com", joined: new Date("2024-07-27").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "DM", desiredCourse: 'kalaripayattu', enrolledCourses: ['kalaripayattu'], whatsappNumber: '9876543285', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Regular' },
    { id: "S077", name: "Inaya Nair", email: "inaya.n@example.com", joined: new Date("2024-07-28").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "IN", desiredCourse: 'kalaripayattu', enrolledCourses: ['kalaripayattu'], whatsappNumber: '9876543286', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Regular' },
    // Zumba
    { id: "S078", name: "Jia Rao", email: "jia.r@example.com", joined: new Date("2024-07-29").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "JR", desiredCourse: 'zumba', enrolledCourses: ['zumba'], whatsappNumber: '9876543287', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Online' },
    { id: "S079", name: "Kiaan Seth", email: "kiaan.s@example.com", joined: new Date("2024-07-30").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "KS", desiredCourse: 'zumba', enrolledCourses: ['zumba'], whatsappNumber: '9876543288', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Online' },
    { id: "S080", name: "Leah Thomas", email: "leah.t@example.com", joined: new Date("2024-07-31").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "LT", desiredCourse: 'zumba', enrolledCourses: ['zumba'], whatsappNumber: '9876543289', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Online' },
    // Gymnastics
    { id: "S081", name: "Mila George", email: "mila.g@example.com", joined: new Date("2024-08-01").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "MG", desiredCourse: 'gymnastics', enrolledCourses: ['gymnastics'], whatsappNumber: '9876543290', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Regular' },
    { id: "S082", name: "Neev Agarwal", email: "neev.a@example.com", joined: new Date("2024-08-02").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "NA", desiredCourse: 'gymnastics', enrolledCourses: ['gymnastics'], whatsappNumber: '9876543291', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Regular' },
    { id: "S083", name: "Aarohi Kulkarni", email: "aarohi.k@example.com", joined: new Date("2024-08-03").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "AK", desiredCourse: 'gymnastics', enrolledCourses: ['gymnastics'], whatsappNumber: '9876543292', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Regular' },
    // Drums
    { id: "S084", name: "Reyansh Mehta", email: "reyansh.m@example.com", joined: new Date("2024-08-04").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "RM", desiredCourse: 'drums', enrolledCourses: ['drums'], whatsappNumber: '9876543293', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Regular' },
    { id: "S085", name: "Tara Prasad", email: "tara.p@example.com", joined: new Date("2024-08-05").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "TP", desiredCourse: 'drums', enrolledCourses: ['drums'], whatsappNumber: '9876543294', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Regular' },
    { id: "S086", name: "Zayn Ahmed", email: "zayn.a@example.com", joined: new Date("2024-08-06").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "ZA", desiredCourse: 'drums', enrolledCourses: ['drums'], whatsappNumber: '9876543295', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Regular' },
    // Violin
    { id: "S087", name: "Alia Bhatt", email: "alia.b@example.com", joined: new Date("2024-08-07").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "AB", desiredCourse: 'violin', enrolledCourses: ['violin'], whatsappNumber: '9876543296', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Online' },
    { id: "S088", name: "Ranbir Kapoor", email: "ranbir.k@example.com", joined: new Date("2024-08-08").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "RK", desiredCourse: 'violin', enrolledCourses: ['violin'], whatsappNumber: '9876543297', admissionCenter: 'Branch 3 (Koramangala)', classMode: 'Online' },
    { id: "S089", name: "Deepika Padukone", email: "deepika.p@example.com", joined: new Date("2024-08-09").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "DP", desiredCourse: 'violin', enrolledCourses: ['violin'], whatsappNumber: '9876543298', admissionCenter: 'Branch 4 (Indiranagar)', classMode: 'Online' },
    // Piano
    { id: "S090", name: "Shah Rukh Khan", email: "srk@example.com", joined: new Date("2024-08-10").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "SRK", desiredCourse: 'piano', enrolledCourses: ['piano'], whatsappNumber: '9876543299', admissionCenter: 'Branch 5 (Jayanagar)', classMode: 'Regular' },
    { id: "S091", name: "Priyanka Chopra", email: "pc@example.com", joined: new Date("2024-08-11").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "PC", desiredCourse: 'piano', enrolledCourses: ['piano'], whatsappNumber: '9876543300', admissionCenter: 'Main Campus (Basavanapura)', classMode: 'Online' },
    { id: "S092", name: "Hrithik Roshan", email: "hr@example.com", joined: new Date("2024-08-12").toISOString(), status: "Active", courses: 1, avatar: "https://placehold.co/100x100.png", initials: "HR", desiredCourse: 'piano', enrolledCourses: ['piano'], whatsappNumber: '9876543301', admissionCenter: 'Branch 2 (Marathahalli)', classMode: 'Regular' },
];

let students: Student[] = [...initialStudents];
let nextId = students.length + 1;

export const getStudents = async (): Promise<Student[]> => {
  // In a real db, this would be an async call
  return Promise.resolve(students);
};

export const addStudent = async (studentData: any) => {
  const newId = `S${String(nextId++).padStart(3, '0')}`;
  const initials = studentData.name.split(' ').map((n:string) => n[0]).join('').toUpperCase();

  const newStudent: Student = {
    id: newId,
    name: studentData.name,
    email: studentData.email,
    joined: studentData.dateOfJoining.toISOString().split('T')[0],
    status: studentData.status,
    courses: 1, // Default to 1 course
    avatar: studentData.photo || `https://placehold.co/100x100.png`,
    initials: initials,
    dob: studentData.dob ? new Date(studentData.dob).toISOString().split('T')[0] : undefined,
    gender: studentData.gender,
    nationality: studentData.nationality,
    fatherName: studentData.fatherName,
    motherName: studentData.motherName,
    whatsappNumber: studentData.whatsappNumber,
    address: studentData.address,
    desiredCourse: studentData.desiredCourse,
    enrolledCourses: [studentData.desiredCourse],
    admissionCenter: studentData.admissionCenter,
    classMode: studentData.classMode,
  };
  students.push(newStudent);
  return Promise.resolve(newStudent);
};

export const resetStudents = () => {
    students = [...initialStudents];
    nextId = students.length + 1;
}

    

    
