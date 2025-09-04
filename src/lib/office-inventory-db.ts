
// In-memory "database" for office inventory.
import { centers } from "./expenses-db";

export const categories = [
    "Stationery",
    "Office Supplies",
    "Daily Use Items",
    "Instruments & Equipment",
    "Furniture",
    "Electronics",
    "Other",
] as const;

export type InventoryItem = {
  id: string;
  name: string;
  category: typeof categories[number];
  stock: number;
  purchaseCost: number;
  vendor?: string;
  lastStockInDate?: string;
  lowStockThreshold: number;
  branch: string;
};

const initialInventory: InventoryItem[] = [
  { id: "INV001", name: "A4 Paper Ream (500 sheets)", category: "Stationery", stock: 20, purchaseCost: 350, vendor: "Local Paper Mill", lowStockThreshold: 10, branch: "Main Campus (Basavanapura)" },
  { id: "INV002", name: "Black Whiteboard Markers (Box of 10)", category: "Stationery", stock: 15, purchaseCost: 200, vendor: "Office Supplies Co.", lowStockThreshold: 5, branch: "Branch 2 (Marathahalli)" },
  { id: "INV003", name: "HP 803 Black Ink Cartridge", category: "Office Supplies", stock: 8, purchaseCost: 700, vendor: "HP World", lowStockThreshold: 5, branch: "Main Campus (Basavanapura)" },
  { id: "INV004", name: "Floor Cleaner (5L)", category: "Daily Use Items", stock: 5, purchaseCost: 800, vendor: "SuperMart", lowStockThreshold: 2, branch: "Branch 3 (Koramangala)" },
  { id: "INV005", name: "Yamaha F310 Acoustic Guitar", category: "Instruments & Equipment", stock: 3, purchaseCost: 8000, vendor: "Music Instruments Inc.", lowStockThreshold: 1, branch: "Main Campus (Basavanapura)" },
];

let inventory: InventoryItem[] = [...initialInventory];
let nextId = inventory.length + 1;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getInventory = async (): Promise<InventoryItem[]> => {
  await delay(300);
  return Promise.resolve(inventory);
};

export const addInventoryItem = async (itemData: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
  await delay(500);
  const newItem: InventoryItem = {
    ...itemData,
    id: `INV${String(nextId++).padStart(3, '0')}`,
    lastStockInDate: new Date().toISOString(),
  };
  inventory.push(newItem);
  return Promise.resolve(newItem);
};

export const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> => {
  await delay(500);
  const itemIndex = inventory.findIndex(item => item.id === id);
  if (itemIndex === -1) throw new Error("Item not found");
  inventory[itemIndex] = { ...inventory[itemIndex], ...updates };
  return Promise.resolve(inventory[itemIndex]);
};

export const deleteInventoryItem = async (id: string): Promise<{ success: boolean }> => {
  await delay(500);
  inventory = inventory.filter(item => item.id !== id);
  return Promise.resolve({ success: true });
};

export const updateStock = async (id: string, type: 'in' | 'out', quantity: number): Promise<InventoryItem> => {
    await delay(300);
    const itemIndex = inventory.findIndex(item => item.id === id);
    if (itemIndex === -1) throw new Error("Item not found");

    if (type === 'in') {
        inventory[itemIndex].stock += quantity;
        inventory[itemIndex].lastStockInDate = new Date().toISOString();
    } else {
        if (inventory[itemIndex].stock < quantity) {
            throw new Error("Insufficient stock for stock out.");
        }
        inventory[itemIndex].stock -= quantity;
    }
    return Promise.resolve(inventory[itemIndex]);
};
