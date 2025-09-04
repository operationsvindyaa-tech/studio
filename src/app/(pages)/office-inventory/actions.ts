
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { 
    addInventoryItem, 
    updateInventoryItem, 
    deleteInventoryItem, 
    updateStock as dbUpdateStock, 
    type InventoryItem,
    categories
} from "@/lib/office-inventory-db";
import { centers } from "@/lib/expenses-db";

const itemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Item name is required."),
  category: z.enum(categories as [string, ...string[]]),
  branch: z.string({ required_error: "Branch is required." }),
  vendor: z.string().optional(),
  purchaseCost: z.coerce.number().min(0, "Purchase cost must be a positive number."),
  stock: z.coerce.number().min(0, "Stock must be a positive number.").optional(),
  lowStockThreshold: z.coerce.number().min(0, "Threshold must be a positive number.").optional(),
});

type State = {
    message: string;
    success: boolean;
    error?: string | null;
};

export async function addItem(prevState: State, formData: FormData): Promise<State> {
  try {
    const data = Object.fromEntries(formData);
    const parsedData = itemSchema.parse(data);
    
    await addInventoryItem({
      ...parsedData,
      stock: parsedData.stock || 0,
      lowStockThreshold: parsedData.lowStockThreshold || 10,
    });
    
    revalidatePath("/office-inventory");
    return { success: true, message: "New item added successfully." };
  } catch (error) {
    return { success: false, message: "Failed to add item.", error: (error as Error).message };
  }
}

export async function updateItem(prevState: State, formData: FormData): Promise<State> {
  try {
    const data = Object.fromEntries(formData);
    const parsedData = itemSchema.parse(data);
    
    if (!parsedData.id) {
      throw new Error("Item ID is missing.");
    }

    await updateInventoryItem(parsedData.id, parsedData);
    
    revalidatePath("/office-inventory");
    return { success: true, message: "Item updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update item.", error: (error as Error).message };
  }
}

export async function deleteItem(id: string): Promise<State> {
    try {
        await deleteInventoryItem(id);
        revalidatePath("/office-inventory");
        return { success: true, message: "Item has been deleted." };
    } catch(error) {
        return { success: false, message: "Failed to delete item.", error: (error as Error).message };
    }
}

export async function updateStock(id: string, type: 'in' | 'out', quantity: number): Promise<State> {
    try {
        await dbUpdateStock(id, type, quantity);
        revalidatePath("/office-inventory");
        return { success: true, message: `Stock for item ${id} has been updated.` };
    } catch(error) {
         return { success: false, message: "Failed to update stock.", error: (error as Error).message };
    }
}
