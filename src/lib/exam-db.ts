
// This is a simple in-memory "database" for demonstration purposes.

import { format, subDays, addDays } from 'date-fns';

export type ExamRecord = {
  id: string;
  studentName: string;
  activity: string;
  examType: string;
  universityName: string;
  feesAmount: number;
  feePaymentDate?: string; // ISO date string
  paymentStatus: "Paid" | "Pending" | "Waived";
  examDate: string; // ISO date string
};

const initialRecords: ExamRecord[] = [
    { id: "EXM001", studentName: "Amelia Rodriguez", activity: "Bharatanatyam", examType: "Annual", universityName: "Gandharva Mahavidyalaya", feesAmount: 1500, feePaymentDate: subDays(new Date(), 10).toISOString(), paymentStatus: "Paid", examDate: addDays(new Date(), 30).toISOString() },
    { id: "EXM002", studentName: "Benjamin Carter", activity: "Vocal Carnatic", examType: "Grading", universityName: "Prayag Sangeet Samiti", feesAmount: 1200, paymentStatus: "Pending", examDate: addDays(new Date(), 45).toISOString() },
    { id: "EXM003", studentName: "Chloe Garcia", activity: "Guitar", examType: "Grade 3", universityName: "Trinity College London", feesAmount: 2500, feePaymentDate: subDays(new Date(), 5).toISOString(), paymentStatus: "Paid", examDate: addDays(new Date(), 60).toISOString() },
    { id: "EXM004", studentName: "David Kim", activity: "Keyboard", examType: "Practical", universityName: "Internal Assessment", feesAmount: 800, paymentStatus: "Waived", examDate: addDays(new Date(), 20).toISOString() },
];

let records: ExamRecord[] = [...initialRecords];
let nextId = records.length + 1;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getExamRecords = async (): Promise<ExamRecord[]> => {
  await delay(500);
  return Promise.resolve(records.sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()));
};

export const addExamRecord = async (recordData: Omit<ExamRecord, 'id'>): Promise<ExamRecord> => {
  await delay(500);
  const newId = `EXM${String(nextId++).padStart(3, '0')}`;
  const newRecord: ExamRecord = {
    ...recordData,
    id: newId,
  };
  records.push(newRecord);
  return Promise.resolve(newRecord);
};

export const updateExamRecord = async (id: string, updates: Partial<ExamRecord>): Promise<ExamRecord> => {
    await delay(500);
    const recordIndex = records.findIndex(r => r.id === id);
    if (recordIndex === -1) {
        throw new Error("Record not found");
    }
    records[recordIndex] = { ...records[recordIndex], ...updates };
    return Promise.resolve(records[recordIndex]);
}

export const deleteExamRecord = async (id: string): Promise<{ success: boolean }> => {
    await delay(500);
    records = records.filter(r => r.id !== id);
    return Promise.resolve({ success: true });
}
