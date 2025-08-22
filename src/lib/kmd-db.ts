
// In-memory "database" for Kids Measurement Details (KMD).

export type KmdRecord = {
  id: string;
  studentId: string;
  studentName: string;
  phone: string;
  activityName: string;
  chest?: string;
  waist?: string;
  hips?: string;
  sleeveLength?: string;
  topLength?: string;
  bottomLength?: string;
  gejjeSize?: string;
  notes?: string;
  lastUpdated: string; // ISO date string
};

const initialRecords: KmdRecord[] = [
  {
    id: "KMD001",
    studentId: "S001",
    studentName: "Amelia Rodriguez",
    phone: "9876543210",
    activityName: "Bharatanatyam",
    chest: "28",
    waist: "26",
    hips: "30",
    sleeveLength: "15",
    topLength: "22",
    bottomLength: "34",
    gejjeSize: "5 inches",
    notes: "Standard temple jewelry set.",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "KMD002",
    studentId: "S002",
    studentName: "Benjamin Carter",
    phone: "9876543211",
    activityName: "Vocal Carnatic",
    chest: "30 (Kurta)",
    waist: "28 (Dhoti)",
    bottomLength: "36",
    gejjeSize: "N/A",
    notes: "",
    lastUpdated: new Date().toISOString(),
  },
];

let records: KmdRecord[] = [...initialRecords];
let nextId = records.length + 1;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getKmdRecords = async (): Promise<KmdRecord[]> => {
  await delay(300);
  return Promise.resolve(records);
};

export const addKmdRecord = async (recordData: Omit<KmdRecord, 'id' | 'lastUpdated'>): Promise<KmdRecord> => {
  await delay(500);
  const newId = `KMD${String(nextId++).padStart(3, '0')}`;
  const newRecord: KmdRecord = {
    ...recordData,
    id: newId,
    lastUpdated: new Date().toISOString(),
  };
  records.push(newRecord);
  return Promise.resolve(newRecord);
};

export const updateKmdRecord = async (id: string, updates: Partial<KmdRecord>): Promise<KmdRecord> => {
  await delay(500);
  const recordIndex = records.findIndex(r => r.id === id);
  if (recordIndex === -1) {
    throw new Error("Record not found");
  }
  const updatedRecord = { 
    ...records[recordIndex], 
    ...updates,
    lastUpdated: new Date().toISOString(),
  };
  records[recordIndex] = updatedRecord;
  return Promise.resolve(updatedRecord);
};

export const deleteKmdRecord = async (id: string): Promise<{ success: boolean }> => {
  await delay(500);
  const initialLength = records.length;
  records = records.filter(r => r.id !== id);
  if (records.length === initialLength) {
    throw new Error("Record not found");
  }
  return Promise.resolve({ success: true });
};
