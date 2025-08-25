
"use server";

import { recordMerchandiseSale } from "@/lib/merchandise-db";
import { revalidatePath } from "next/cache";

type State = {
    message: string;
    success: boolean;
};

export async function purchaseMerchandise(itemId: string, quantity: number): Promise<State> {
  try {
    if (!itemId || quantity <= 0) {
      return {
        message: "Invalid item or quantity.",
        success: false,
      };
    }

    await recordMerchandiseSale(itemId, quantity);
    
    // Revalidate both the student and admin merchandise pages
    revalidatePath("/student-merchandise");
    revalidatePath("/merchandise");

    return {
      message: "Purchase successful! Your order has been recorded.",
      success: true,
    };
  } catch (error: any) {
    console.error("Error purchasing merchandise:", error);
    return {
      message: error.message || "There was an error processing your purchase. Please try again.",
      success: false,
    };
  }
}
