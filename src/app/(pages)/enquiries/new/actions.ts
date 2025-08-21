
"use server";

import { z } from "zod";
import { addEnquiry } from "@/lib/enquiries-db";
import { revalidatePath } from "next/cache";

const enquiryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().min(1, "Age is required."),
  activity: z.string({ required_error: "Please select an activity." }),
  contactNumber: z.string().min(10, "A valid contact number is required."),
  whatsappNumber: z.string().min(10, "A valid WhatsApp number is required."),
  branch: z.string({ required_error: "Please select a branch." }),
  coordinator: z.string({ required_error: "Please select a coordinator." }),
  satisfaction: z.coerce.number().min(1, "Please provide a rating.").max(5),
});


type State = {
    message: string;
    success: boolean;
};

export async function createEnquiry(prevState: State, formData: FormData): Promise<State> {
  try {
     const parsedData = enquiryFormSchema.parse(Object.fromEntries(formData));

    await addEnquiry({
        name: parsedData.name,
        contact: parsedData.contactNumber,
        email: `enquiry+${Date.now()}@example.com`, // Email is not in the form, but required by db
        courseInterest: parsedData.activity,
        source: 'walk-in', // Source is not in the form, default to walk-in
        notes: `
            Age: ${parsedData.age},
            WhatsApp: ${parsedData.whatsappNumber},
            Branch: ${parsedData.branch},
            Coordinator: ${parsedData.coordinator},
            Satisfaction: ${parsedData.satisfaction}/5
        `
    });
    
    // --- SMS Notification Simulation ---
    // In a real application, you would integrate with an SMS service here.
    const smsMessage = `Hi ${parsedData.name}, thank you for your enquiry about ${parsedData.activity} at our ${parsedData.branch} branch. Our coordinator, ${parsedData.coordinator}, will contact you shortly. VINDYAA - The Altitude of Art.`;
    
    console.log(`---
    SENDING ENQUIRY CONFIRMATION SMS:
    To: ${parsedData.contactNumber}
    Message: ${smsMessage}
    ---`);
    // --- End Simulation ---

    revalidatePath("/enquiries");
    
    return {
      message: "Enquiry has been submitted successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error creating enquiry:", error);
    if (error instanceof z.ZodError) {
        return {
            message: "Validation failed: " + error.errors.map(e => e.message).join(', '),
            success: false,
        }
    }
    return {
      message: "There was an error submitting the enquiry. Please try again.",
      success: false,
    };
  }
}
