
// This is a simple in-memory "database" for demonstration purposes.
// In a real application, you would use a proper database like Firestore, PostgreSQL, etc.

export type Staff = {
    id: string; // Employee Code
    fullName: string;
    initials: string;
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
    };
    payroll: {
        salary: number; // monthly
        bankDetails: {
            accountNumber: string;
            ifscCode: string;
        };
        benefitsNumber: string; // PF/ESI
    };
};

const initialStaff: Staff[] = [
    {
        id: "EMP001",
        fullName: "Priya Sharma",
        initials: "PS",
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
        },
        payroll: {
            salary: 75000,
            bankDetails: { accountNumber: "123456789012", ifscCode: "HDFC000123" },
            benefitsNumber: "BN12345678",
        },
    },
    {
        id: "EMP002",
        fullName: "Ravi Kumar",
        initials: "RK",
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
        },
        payroll: {
            salary: 72000,
            bankDetails: { accountNumber: "234567890123", ifscCode: "ICIC000234" },
            benefitsNumber: "BN23456789",
        },
    },
    {
        id: "EMP003",
        fullName: "Meera Iyer",
        initials: "MI",
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
        },
        payroll: {
            salary: 85000,
            bankDetails: { accountNumber: "345678901234", ifscCode: "SBIN000345" },
            benefitsNumber: "BN34567890",
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

export const addStaff = async (staffData: Omit<Staff, 'id' | 'initials' | 'personalInfo.photo'>): Promise<Staff> => {
  await delay(500);
  const newId = `EMP${String(nextId++).padStart(3, '0')}`;
  const newStaffMember: Staff = {
    id: newId,
    ...staffData,
    initials: getInitials(staffData.fullName),
    personalInfo: {
        ...staffData.personalInfo,
        photo: `https://placehold.co/100x100.png`,
    }
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
