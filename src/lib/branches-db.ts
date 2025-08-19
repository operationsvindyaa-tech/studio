// This is a simple in-memory "database" for demonstration purposes.
// In a real application, you would use a proper database like Firestore, PostgreSQL, etc.

export type Branch = {
  id: string;
  name: string;
  location: string;
  manager: string;
  contact: string;
};

const initialBranches: Branch[] = [
  { id: "B01", name: "Main Campus", location: "Basavanapura", manager: "Mr. Anand Kumar", contact: "9876543210" },
  { id: "B02", name: "Branch 2", location: "Marathahalli", manager: "Ms. Sunita Reddy", contact: "9876543211" },
  { id: "B03", name: "Branch 3", location: "Koramangala", manager: "Mr. Rajesh Sharma", contact: "9876543212" },
  { id: "B04", name: "Branch 4", location: "Indiranagar", manager: "Ms. Priya Menon", contact: "9876543213" },
  { id: "B05", name: "Branch 5", location: "Jayanagar", manager: "Mr. Vijay Kumar", contact: "9876543214" },
];

let branches: Branch[] = [...initialBranches];
let nextId = branches.length + 1;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getBranches = async (): Promise<Branch[]> => {
  await delay(300);
  return Promise.resolve(branches);
};

export const getBranchById = async (id: string): Promise<Branch | undefined> => {
  await delay(200);
  return Promise.resolve(branches.find(b => b.id === id));
};

export const addBranch = async (branchData: Omit<Branch, 'id'>): Promise<Branch> => {
  await delay(500);
  const newId = `B${String(nextId++).padStart(2, '0')}`;
  const newBranch: Branch = {
    ...branchData,
    id: newId,
  };
  branches.push(newBranch);
  return Promise.resolve(newBranch);
};

export const updateBranch = async (id: string, updates: Partial<Branch>): Promise<Branch> => {
  await delay(500);
  const branchIndex = branches.findIndex(b => b.id === id);
  if (branchIndex === -1) {
    throw new Error("Branch not found");
  }
  const updatedBranch = { ...branches[branchIndex], ...updates };
  branches[branchIndex] = updatedBranch;
  return Promise.resolve(updatedBranch);
};

export const deleteBranch = async (id: string): Promise<{ success: boolean }> => {
  await delay(500);
  const initialLength = branches.length;
  branches = branches.filter(b => b.id !== id);
  if (branches.length === initialLength) {
    throw new Error("Branch not found");
  }
  return Promise.resolve({ success: true });
};
