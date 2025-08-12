
// This is a simple in-memory "database" for demonstration purposes.

export type Enquiry = {
  id: string;
  name: string;
  contact: string;
  email: string;
  courseInterest: string;
  status: "New" | "Contacted" | "Enrolled" | "Closed";
  enquiryDate: string; // ISO date string
  source: string;
  notes?: string;
};

const initialEnquiries: Enquiry[] = [
    { id: "E001", name: "Rohan Gupta", contact: "9876543210", email: "rohan.g@example.com", courseInterest: "Guitar", status: "New", enquiryDate: new Date("2024-07-28").toISOString(), source: "Website" },
    { id: "E002", name: "Sneha Patel", contact: "9876543211", email: "sneha.p@example.com", courseInterest: "Bharatanatyam", status: "Contacted", enquiryDate: new Date("2024-07-27").toISOString(), source: "Friend/Referral" },
    { id: "E003", name: "Ajay Singh", contact: "9876543212", email: "ajay.s@example.com", courseInterest: "Yoga", status: "Enrolled", enquiryDate: new Date("2024-07-25").toISOString(), source: "Social Media" },
    { id: "E004", name: "Priya Rao", contact: "9876543213", email: "priya.r@example.com", courseInterest: "Vocal Carnatic", status: "Closed", enquiryDate: new Date("2024-07-24").toISOString(), source: "Advertisement" },
    { id: "E005", name: "Karan Verma", contact: "9876543214", email: "karan.v@example.com", courseInterest: "Keyboard/Piano", status: "New", enquiryDate: new Date("2024-07-29").toISOString(), source: "Search Engine" },
];

let enquiries: Enquiry[] = [...initialEnquiries];
let nextId = enquiries.length + 1;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getEnquiries = async (): Promise<Enquiry[]> => {
  await delay(500);
  return Promise.resolve(enquiries);
};

export const getEnquiryById = async (id: string): Promise<Enquiry | undefined> => {
    await delay(300);
    return Promise.resolve(enquiries.find(e => e.id === id));
}

export const addEnquiry = async (enquiryData: Omit<Enquiry, 'id' | 'enquiryDate' | 'status'>): Promise<Enquiry> => {
  await delay(500);
  const newId = `E${String(nextId++).padStart(3, '0')}`;
  const newEnquiry: Enquiry = {
    ...enquiryData,
    id: newId,
    enquiryDate: new Date().toISOString(),
    status: "New",
  };
  enquiries.unshift(newEnquiry); // Add to the top of the list
  return Promise.resolve(newEnquiry);
};

export const updateEnquiry = async (id: string, updates: Partial<Enquiry>): Promise<Enquiry> => {
    await delay(500);
    const enquiryIndex = enquiries.findIndex(e => e.id === id);
    if (enquiryIndex === -1) {
        throw new Error("Enquiry not found");
    }
    const originalEnquiry = enquiries[enquiryIndex];
    const updatedEnquiry = { ...originalEnquiry, ...updates };
    enquiries[enquiryIndex] = updatedEnquiry;
    return Promise.resolve(updatedEnquiry);
}

export const deleteEnquiry = async (id: string): Promise<{ success: boolean }> => {
    await delay(500);
    const initialLength = enquiries.length;
    enquiries = enquiries.filter(e => e.id !== id);
    if (enquiries.length === initialLength) {
         throw new Error("Enquiry not found");
    }
    return Promise.resolve({ success: true });
}

export const resetEnquiries = () => {
    enquiries = [...initialEnquiries];
    nextId = enquiries.length + 1;
}
