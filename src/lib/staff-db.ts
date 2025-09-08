
// This is a simple in-memory "database" for demonstration purposes.
// In a real application, you would use a proper database like Firestore, PostgreSQL, etc.

export type Staff = {
    id: string; // Employee Code
    fullName: string;
    initials: string;
    designation: string; // Added designation field
    personalInfo: {
        dob: string; // ISO date string
        gender: 'Male' | 'Female' | 'Other';
        contactNumber: string;
        email: string;
        address: string;
        emergencyContact: {
            name: string;
            number: string;
        };
        photo: string;
    };
    jobDetails: {
        department: 'Academics' | 'Administration' | 'Support Staff' | 'Management';
        role: string;
        reportingManager: string;
        dateOfJoining: string; // ISO date string
        employmentType: 'Full-time' | 'Part-time' | 'Contract';
        workLocation: string;
        branch: string;
        workingDays?: string[];
    };
    payroll: {
        salary: number; // monthly
        bankDetails: {
            accountNumber: string;
            ifscCode: string;
        };
        benefitsNumber: string; // PF/ESI/PAN
    };
};

export type AddStaffData = Omit<Staff, 'id' | 'initials'>;


const initialStaff: Staff[] = [
    {
        id: "EMP001",
        fullName: "Priya Sharma",
        initials: "PS",
        designation: "Bharatanatyam Guru",
        personalInfo: {
            dob: "1985-06-15",
            gender: "Female",
            contactNumber: "(555) 111-2222",
            email: "priya.sharma@example.com",
            address: "123 Dance Ave, Bangalore",
            emergencyContact: { name: "Ravi Sharma", number: "(555) 111-2223" },
            photo: "https://placehold.co/100x100.png",
        },
        jobDetails: {
            department: "Academics",
            role: "Bharatanatyam Guru",
            reportingManager: "Meera Iyer",
            dateOfJoining: "2018-03-01",
            employmentType: "Full-time",
            workLocation: "Main Campus",
            branch: "Main Campus",
            workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
        payroll: {
            salary: 75000,
            bankDetails: { accountNumber: "********9012", ifscCode: "HDFC000123" },
            benefitsNumber: "ABCDE1234F", // PAN
        },
    },
    {
        id: "EMP002",
        fullName: "Ravi Kumar",
        initials: "RK",
        designation: "Vocal Carnatic Ustad",
        personalInfo: {
            dob: "1990-11-20",
            gender: "Male",
            contactNumber: "(555) 222-3333",
            email: "ravi.kumar@example.com",
            address: "456 Music St, Bangalore",
            emergencyContact: { name: "Sunita Kumar", number: "(555) 222-3334" },
            photo: "https://placehold.co/100x100.png",
        },
        jobDetails: {
            department: "Academics",
            role: "Vocal Carnatic Ustad",
            reportingManager: "Meera Iyer",
            dateOfJoining: "2020-07-10",
            employmentType: "Full-time",
            workLocation: "Main Campus",
            branch: "Main Campus",
            workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
        payroll: {
            salary: 72000,
            bankDetails: { accountNumber: "********0123", ifscCode: "ICIC000234" },
            benefitsNumber: "FGHIJ5678K", // PAN
        },
    },
    {
        id: "EMP003",
        fullName: "Anjali Mehta",
        initials: "AM",
        designation: "Keyboard & Piano Instructor",
        personalInfo: {
            dob: "1992-04-10",
            gender: "Female",
            contactNumber: "(555) 333-4444",
            email: "anjali.mehta@example.com",
            address: "789 Artistry Ln, Bangalore",
            emergencyContact: { name: "Sanjay Mehta", number: "(555) 333-4445" },
            photo: "https://placehold.co/100x100.png",
        },
        jobDetails: {
            department: "Academics",
            role: "Keyboard & Piano Instructor",
            reportingManager: "Meera Iyer",
            dateOfJoining: "2021-01-20",
            employmentType: "Part-time",
            workLocation: "Main Campus",
            branch: "Main Campus",
            workingDays: ["Tuesday", "Thursday", "Saturday"],
        },
        payroll: {
            salary: 55000,
            bankDetails: { accountNumber: "********1234", ifscCode: "AXIS000345" },
            benefitsNumber: "KLMNO9012L", // PAN
        },
    },
    {
        id: "EMP004",
        fullName: "Vikram Singh",
        initials: "VS",
        designation: "Guitar Teacher",
        personalInfo: {
            dob: "1988-09-05",
            gender: "Male",
            contactNumber: "(555) 444-5555",
            email: "vikram.singh@example.com",
            address: "101 Melody Rd, Bangalore",
            emergencyContact: { name: "Deepa Singh", number: "(555) 444-5556" },
            photo: "https://placehold.co/100x100.png",
        },
        jobDetails: {
            department: "Academics",
            role: "Guitar Teacher",
            reportingManager: "Meera Iyer",
            dateOfJoining: "2022-05-15",
            employmentType: "Full-time",
            workLocation: "Main Campus",
            branch: "Main Campus",
            workingDays: ["Monday", "Wednesday", "Friday", "Saturday"],
        },
        payroll: {
            salary: 52000,
            bankDetails: { accountNumber: "********2345", ifscCode: "KOTK000456" },
            benefitsNumber: "PQRST3456M", // PAN
        },
    },
    {
        id: "EMP005",
        fullName: "Sunita Reddy",
        initials: "SR",
        designation: "Yoga Acharya",
        personalInfo: {
            dob: "1980-12-30",
            gender: "Female",
            contactNumber: "(555) 555-6666",
            email: "sunita.reddy@example.com",
            address: "202 Wellness Way, Bangalore",
            emergencyContact: { name: "Anil Reddy", number: "(555) 555-6667" },
            photo: "https://placehold.co/100x100.png",
        },
        jobDetails: {
            department: "Academics",
            role: "Yoga Acharya",
            reportingManager: "Meera Iyer",
            dateOfJoining: "2019-11-01",
            employmentType: "Part-time",
            workLocation: "Wellness Center",
            branch: "Branch 2",
            workingDays: ["Monday", "Wednesday", "Friday"],
        },
        payroll: {
            salary: 60000,
            bankDetails: { accountNumber: "********3456", ifscCode: "YESB000567" },
            benefitsNumber: "UVWXY7890N", // PAN
        },
    },
    {
        id: "EMP006",
        fullName: "Arjun Desai",
        initials: "AD",
        designation: "Kalaripayattu Master",
        personalInfo: {
            dob: "1986-07-22",
            gender: "Male",
            contactNumber: "(555) 666-7777",
            email: "arjun.desai@example.com",
            address: "303 Warrior Path, Bangalore",
            emergencyContact: { name: "Priya Desai", number: "(555) 666-7778" },
            photo: "https://placehold.co/100x100.png",
        },
        jobDetails: {
            department: "Academics",
            role: "Kalaripayattu Master",
            reportingManager: "Meera Iyer",
            dateOfJoining: "2020-02-18",
            employmentType: "Full-time",
            workLocation: "Main Campus",
            branch: "Main Campus",
            workingDays: ["Tuesday", "Thursday", "Saturday", "Sunday"],
        },
        payroll: {
            salary: 68000,
            bankDetails: { accountNumber: "********4567", ifscCode: "IDFC000678" },
            benefitsNumber: "ZABCD1234P", // PAN
        },
    },
    {
        id: "EMP007",
        fullName: "Meera Iyer",
        initials: "MI",
        designation: "Admin & Operations Head",
        personalInfo: {
            dob: "1982-02-25",
            gender: "Female",
            contactNumber: "(555) 999-8888",
            email: "meera.iyer@example.com",
            address: "789 Admin Rd, Bangalore",
            emergencyContact: { name: "Anand Iyer", number: "(555) 999-8887" },
            photo: "https://placehold.co/100x100.png",
        },
        jobDetails: {
            department: "Administration",
            role: "Admin & Operations Head",
            reportingManager: "Director",
            dateOfJoining: "2015-01-15",
            employmentType: "Full-time",
            workLocation: "Main Campus",
            branch: "Main Campus",
            workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
        payroll: {
            salary: 85000,
            bankDetails: { accountNumber: "********5678", ifscCode: "SBIN000345" },
            benefitsNumber: "EFGHI5678Q", // PAN
        },
    },
    {
        id: "EMP008",
        fullName: "Suresh Patil",
        initials: "SP",
        designation: "Front Desk Executive",
        personalInfo: {
            dob: "1995-03-12",
            gender: "Male",
            contactNumber: "(555) 123-4567",
            email: "suresh.patil@example.com",
            address: "111 Support St, Bangalore",
            emergencyContact: { name: "Kavita Patil", number: "(555) 123-4568" },
            photo: "https://placehold.co/100x100.png",
        },
        jobDetails: {
            department: "Support Staff",
            role: "Front Desk Executive",
            reportingManager: "Meera Iyer",
            dateOfJoining: "2022-08-01",
            employmentType: "Full-time",
            workLocation: "Main Campus",
            branch: "Main Campus",
            workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        },
        payroll: {
            salary: 35000,
            bankDetails: { accountNumber: "********6789", ifscCode: "BARB000789" },
            benefitsNumber: "JKLMN9012R", // PAN
        },
    },
    {
        id: "EMP009",
        fullName: "Deepa Nair",
        initials: "DN",
        designation: "Accountant",
        personalInfo: {
            dob: "1993-08-20",
            gender: "Female",
            contactNumber: "(555) 234-5678",
            email: "deepa.nair@example.com",
            address: "222 Accounts Ave, Bangalore",
            emergencyContact: { name: "Rajesh Nair", number: "(555) 234-5679" },
            photo: "https://placehold.co/100x100.png",
        },
        jobDetails: {
            department: "Administration",
            role: "Accountant",
            reportingManager: "Meera Iyer",
            dateOfJoining: "2021-10-05",
            employmentType: "Full-time",
            workLocation: "Main Campus",
            branch: "Main Campus",
            workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
        payroll: {
            salary: 48000,
            bankDetails: { accountNumber: "********7890", ifscCode: "PUNB000890" },
            benefitsNumber: "OPQRS3456S", // PAN
        },
    },
    {
        id: "EMP010",
        fullName: "Rajesh Gupta",
        initials: "RG",
        designation: "Maintenance Staff",
        personalInfo: {
            dob: "1980-01-10",
            gender: "Male",
            contactNumber: "(555) 345-6789",
            email: "rajesh.gupta@example.com",
            address: "333 Clean St, Bangalore",
            emergencyContact: { name: "Pooja Gupta", number: "(555) 345-6780" },
            photo: "https://placehold.co/100x100.png",
        },
        jobDetails: {
            department: "Support Staff",
            role: "Maintenance Staff",
            reportingManager: "Meera Iyer",
            dateOfJoining: "2017-06-20",
            employmentType: "Contract",
            workLocation: "Main Campus",
            branch: "Main Campus",
            workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        },
        payroll: {
            salary: 22000,
            bankDetails: { accountNumber: "********8901", ifscCode: "CNRB000901" },
            benefitsNumber: "TUVWX7890T", // PAN
        },
    },
    {
        id: "EMP011",
        fullName: "Nandini Rao",
        initials: "NR",
        designation: "Art & Craft Teacher",
        personalInfo: {
            dob: "1998-05-18",
            gender: "Female",
            contactNumber: "(555) 456-7890",
            email: "nandini.rao@example.com",
            address: "444 Creative Corner, Bangalore",
            emergencyContact: { name: "Kiran Rao", number: "(555) 456-7891" },
            photo: "https://placehold.co/100x100.png",
        },
        jobDetails: {
            department: "Academics",
            role: "Art & Craft Teacher",
            reportingManager: "Meera Iyer",
            dateOfJoining: "2023-02-15",
            employmentType: "Part-time",
            workLocation: "Branch 2 (Marathahalli)",
            branch: "Branch 2",
            workingDays: ["Tuesday", "Thursday", "Saturday"],
        },
        payroll: {
            salary: 40000,
            bankDetails: { accountNumber: "********9012", ifscCode: "UBIN000012" },
            benefitsNumber: "YZABC3456U", // PAN
        },
    },
    {
        id: "EMP012",
        fullName: "Amit Verma",
        initials: "AV",
        designation: "Director",
        personalInfo: {
            dob: "1975-10-02",
            gender: "Male",
            contactNumber: "(555) 567-8901",
            email: "amit.verma@example.com",
            address: "555 Director's Quarters, Bangalore",
            emergencyContact: { name: "Shalini Verma", number: "(555) 567-8902" },
            photo: "https://placehold.co/100x100.png",
        },
        jobDetails: {
            department: "Management",
            role: "Director",
            reportingManager: "Board",
            dateOfJoining: "2010-01-01",
            employmentType: "Full-time",
            workLocation: "Main Campus",
            branch: "Main Campus",
            workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        },
        payroll: {
            salary: 150000,
            bankDetails: { accountNumber: "********0123", ifscCode: "IOBA000123" },
            benefitsNumber: "CDEFG7890V", // PAN
        },
    },
];

let staff: Staff[] = [...initialStaff];
let nextId = staff.length + 1;

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getStaff = async (): Promise<Staff[]> => {
  await delay(500); // Simulate network latency
  return Promise.resolve(staff);
};

export const getStaffById = async (id: string): Promise<Staff | undefined> => {
    await delay(300);
    return Promise.resolve(staff.find(s => s.id === id));
}

export const addStaff = async (staffData: AddStaffData): Promise<Staff> => {
  await delay(500);
  const newId = `EMP${String(nextId++).padStart(3, '0')}`;
  const newStaffMember: Staff = {
    id: newId,
    ...staffData,
    initials: getInitials(staffData.fullName),
  };
  staff.push(newStaffMember);
  return Promise.resolve(newStaffMember);
};

export const updateStaff = async (id: string, updates: Partial<Staff>): Promise<Staff> => {
    await delay(500);
    const staffIndex = staff.findIndex(s => s.id === id);
    if (staffIndex === -1) {
        throw new Error("Staff member not found");
    }
    const originalStaff = staff[staffIndex];
    const updatedStaff = {
        ...originalStaff,
        ...updates,
        initials: updates.fullName ? getInitials(updates.fullName) : originalStaff.initials,
    };
    staff[staffIndex] = updatedStaff;
    return Promise.resolve(updatedStaff);
}

export const deleteStaff = async (id: string): Promise<{ success: boolean }> => {
    await delay(500);
    const initialLength = staff.length;
    staff = staff.filter(s => s.id !== id);
    if (staff.length === initialLength) {
         throw new Error("Staff member not found");
    }
    return Promise.resolve({ success: true });
}

export const resetStaff = () => {
    staff = [...initialStaff];
    nextId = staff.length + 1;
}
