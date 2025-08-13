
import { getStudents, type Student } from "./db";
import { format } from 'date-fns';

export type Activity = {
  name: string;
  description?: string;
  fee: number;
};

export type BillingStatus = "Paid" | "Due" | "Overdue";

export type StudentBillingInfo = {
  id: string;
  studentId: string;
  name: string;
  email?: string;
  whatsappNumber?: string;
  activities: Activity[];
  admissionFee?: number;
  discount?: number;
  tax?: number;
  status: BillingStatus;
  dueDate: string;
  paymentDate?: string;
  months: string[];
};

export const activityHeads = [
    { name: "Admission Fee", fee: 1000 },
    { name: "Tuition Fee", fee: 2500 },
    { name: "Exam Fee", fee: 500 },
    { name: "Annual Day Fee", fee: 1000 },
    { name: "Uniform Fee", fee: 1500 },
    { name: "Books & Supplies", fee: 800 },
    { name: "Late Fee", fee: 200 },
    { name: "Other", fee: 0 },
];

export const courseFees: { [key: string]: number } = {
  "bharatanatyam": 2500,
  "vocal-carnatic": 3000,
  "keyboard-piano": 2800,
  "guitar": 2200,
  "yoga": 1800,
  "western-dance": 2000,
  "art-craft": 1500,
  "karate": 1700,
  "kalaripayattu": 2300,
  "zumba": 1600,
  "gymnastics": 2100,
};

export const calculateTotal = (student: StudentBillingInfo) => {
    const activitiesTotal = student.activities.reduce((sum, activity) => sum + activity.fee, 0);
    const admissionFee = student.admissionFee || 0;
    const subtotal = activitiesTotal + admissionFee;
    const discount = student.discount || 0;
    const subtotalAfterDiscount = subtotal - discount;
    const tax = student.tax ? (subtotalAfterDiscount * student.tax) / 100 : 0;
    return subtotalAfterDiscount + tax;
}


// In-memory cache for billing data to ensure consistency across pages
let billingDataCache: StudentBillingInfo[] | null = null;

export const getBillingData = async (forceRefresh: boolean = false): Promise<StudentBillingInfo[]> => {
    if (billingDataCache && !forceRefresh) {
        return Promise.resolve(billingDataCache);
    }

    try {
        const students = await getStudents();
        const billingRecords = students.map((student, index) => {
            const activities: Activity[] = [];
            const currentMonth = format(new Date(), 'MMMM');
            const courseName = student.desiredCourse?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || "Course Fee";
            
            if (student.desiredCourse && courseFees[student.desiredCourse]) {
                activities.push({
                    name: "Tuition Fee",
                    fee: courseFees[student.desiredCourse.toLowerCase()] || 2000,
                    description: `Tuition Fee for ${courseName} for the month of ${currentMonth}`
                });
            }
            
            const statuses: Array<"Paid" | "Due" | "Overdue"> = ["Paid", "Due", "Overdue"];
            const status = statuses[index % 3];
            const dueDate = new Date();
            if (status === 'Overdue') {
                dueDate.setMonth(dueDate.getMonth() - 1);
            } else {
                dueDate.setDate(dueDate.getDate() + 5);
            }

            return {
                id: `B${student.id.padStart(4, '0')}`,
                studentId: student.id,
                name: student.name,
                email: student.email,
                whatsappNumber: student.whatsappNumber,
                activities,
                admissionFee: index < 2 ? 1000 : undefined,
                discount: index === 3 ? 200 : undefined,
                tax: index === 1 ? 18 : 0,
                status: status,
                dueDate: dueDate.toISOString().split('T')[0],
                months: [currentMonth],
                paymentDate: status === 'Paid' ? new Date().toISOString().split('T')[0] : undefined,
            };
        });
        billingDataCache = billingRecords;
        return billingRecords;
    } catch (error) {
        console.error("Failed to generate billing data", error);
        return [];
    }
};

export const updateBillingData = (newData: StudentBillingInfo[]) => {
    billingDataCache = newData;
};
