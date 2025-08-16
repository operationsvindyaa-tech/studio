
// This is a simple in-memory "database" for demonstration purposes.

import { format, subDays } from 'date-fns';

export type Expense = {
  id: string;
  head: string;
  center: string;
  date: string; // ISO date string
  amount: number;
  description?: string;
};

export const expenseHeads = [
    "Rent",
    "Utilities (Electricity, Water)",
    "Salaries & Wages",
    "Marketing & Advertising",
    "Office Supplies",
    "Maintenance & Repairs",
    "Telephone & Internet",
    "Travel Expenses",
    "Refreshments",
    "Petty Cash",
    "Event Expenses",
    "Other",
];

export const centers = [
  "Main Campus (Basavanapura)",
  "Branch 2 (Marathahalli)",
  "Branch 3 (Koramangala)",
  "Branch 4 (Indiranagar)",
  "Branch 5 (Jayanagar)",
];


const initialExpenses: Expense[] = [
    { id: "EXP001", head: "Utilities (Electricity, Water)", center: "Main Campus (Basavanapura)", date: subDays(new Date(), 5).toISOString(), amount: 12500, description: "Monthly electricity and water bill." },
    { id: "EXP002", head: "Office Supplies", center: "Branch 2 (Marathahalli)", date: subDays(new Date(), 10).toISOString(), amount: 3200, description: "Stationery and printing supplies." },
    { id: "EXP003", head: "Marketing & Advertising", center: "Main Campus (Basavanapura)", date: subDays(new Date(), 15).toISOString(), amount: 25000, description: "Social media campaign for new admissions." },
    { id: "EXP004", head: "Petty Cash", center: "Branch 3 (Koramangala)", date: subDays(new Date(), 2).toISOString(), amount: 1500, description: "Daily petty cash expenses." },
    { id: "EXP005", head: "Maintenance & Repairs", center: "Main Campus (Basavanapura)", date: subDays(new Date(), 20).toISOString(), amount: 8000, description: "AC repair and plumbing work." },
    { id: "EXP006", head: "Rent", center: "Branch 4 (Indiranagar)", date: subDays(new Date(), 30).toISOString(), amount: 50000, description: `Rent for ${format(subDays(new Date(), 30), 'MMMM')}` },
];

let expenses: Expense[] = [...initialExpenses];
let nextId = expenses.length + 1;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getExpenses = async (): Promise<Expense[]> => {
  await delay(500);
  return Promise.resolve(expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
};

export const addExpense = async (expenseData: Omit<Expense, 'id'>): Promise<Expense> => {
  await delay(500);
  const newId = `EXP${String(nextId++).padStart(3, '0')}`;
  const newExpense: Expense = {
    ...expenseData,
    id: newId,
  };
  expenses.unshift(newExpense);
  return Promise.resolve(newExpense);
};

export const updateExpense = async (id: string, updates: Partial<Expense>): Promise<Expense> => {
    await delay(500);
    const expenseIndex = expenses.findIndex(e => e.id === id);
    if (expenseIndex === -1) {
        throw new Error("Expense not found");
    }
    const originalExpense = expenses[expenseIndex];
    const updatedExpense = { ...originalExpense, ...updates };
    expenses[expenseIndex] = updatedExpense;
    return Promise.resolve(updatedExpense);
}

export const deleteExpense = async (id: string): Promise<{ success: boolean }> => {
    await delay(500);
    const initialLength = expenses.length;
    expenses = expenses.filter(e => e.id !== id);
    if (expenses.length === initialLength) {
         throw new Error("Expense not found");
    }
    return Promise.resolve({ success: true });
}
