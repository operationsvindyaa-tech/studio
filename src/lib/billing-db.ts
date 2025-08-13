
import { getStudents, type Student } from "./db";
import { format, subMonths, getMonth } from 'date-fns';

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
        const billingRecords: StudentBillingInfo[] = [];
        const today = new Date();
        const currentMonthIndex = getMonth(today);

        students.forEach((student, studentIndex) => {
            // Generate invoices for the last 6 months including the current month
            for (let i = 0; i <= 6; i++) {
                const invoiceDate = subMonths(today, i);
                const invoiceMonth = format(invoiceDate, 'MMMM');
                const invoiceMonthIndex = getMonth(invoiceDate);
                
                const courseName = student.desiredCourse?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || "Course Fee";
                const fee = courseFees[student.desiredCourse?.toLowerCase() || ''] || 2000;

                const activities: Activity[] = [{
                    name: "Tuition Fee",
                    fee: fee,
                    description: `Tuition Fee for ${courseName} for the month of ${invoiceMonth}`
                }];
                
                let status: BillingStatus;
                // Logic to create a mix of statuses
                if (invoiceMonthIndex < currentMonthIndex - 2) { // More than 2 months ago
                    status = "Paid";
                } else if (invoiceMonthIndex < currentMonthIndex -1) { // 2 months ago
                     status = studentIndex % 4 === 0 ? "Overdue" : "Paid";
                } else if (invoiceMonthIndex < currentMonthIndex) { // Last month
                    status = studentIndex % 3 === 0 ? "Overdue" : (studentIndex % 3 === 1 ? "Due" : "Paid");
                } else { // Current month
                    status = "Due";
                }
                
                const dueDate = new Date(invoiceDate);
                dueDate.setDate(dueDate.getDate() + 15);

                const record: StudentBillingInfo = {
                    id: `B${student.id.padStart(4, '0')}-${format(invoiceDate, 'yyyyMM')}`,
                    studentId: student.id,
                    name: student.name,
                    email: student.email,
                    whatsappNumber: student.whatsappNumber,
                    activities,
                    status: status,
                    dueDate: dueDate.toISOString().split('T')[0],
                    months: [invoiceMonth],
                    paymentDate: status === 'Paid' ? new Date(invoiceDate).toISOString().split('T')[0] : undefined,
                };
                billingRecords.push(record);
            }
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
