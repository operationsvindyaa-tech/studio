
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addDemoRequest } from "@/lib/demo-requests-db";

const demoFormSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(10, "A valid phone number is required."),
  email: z.string().email("A valid email is required."),
  activityName: z.string({ required_error: "Please select an activity." }),
  preferredDate: z.date({ required_error: "Please select a date." }),
});

type State = {
    message: string;
    success: boolean;
};

export async function createDemoRequest(prevState: State, formData: z.infer<typeof demoFormSchema>): Promise<State> {
  try {
    const parsedData = demoFormSchema.parse(formData);

    await addDemoRequest(parsedData);

    // --- Notification Simulation ---
    // In a real application, you would integrate with an SMS/Email service here.
    
    // 1. Notify the student
    console.log(`---
    SENDING DEMO CONFIRMATION TO STUDENT:
    To: ${parsedData.phone}
    Message: Hi ${parsedData.studentName}, we've received your request for a ${parsedData.activityName} demo on ${parsedData.preferredDate.toLocaleDateString()}. Our team will contact you shortly to confirm the schedule.
    Thank you, VINDYAA.
    ---`);

    // 2. Notify the branch in-charge
     console.log(`---
    SENDING DEMO NOTIFICATION TO BRANCH IN-CHARGE:
    To: branch-incharge@vindyaa.com
    Subject: New Demo Request
    Body:
    A new demo has been requested.
    Student: ${parsedData.studentName}
    Contact: ${parsedData.phone} / ${parsedData.email}
    Activity: ${parsedData.activityName}
    Preferred Date: ${parsedData.preferredDate.toLocaleDateString()}
    Please contact the student to confirm the time slot.
    ---`);


    revalidatePath("/activity-demo");
    
    return {
      message: "Your demo request has been submitted successfully! We will contact you shortly to confirm.",
      success: true,
    };
  } catch (error) {
    console.error("Error creating demo request:", error);
    if (error instanceof z.ZodError) {
        return {
            message: "Validation failed: " + error.errors.map(e => e.message).join(', '),
            success: false,
        }
    }
    return {
      message: "There was an error submitting your request. Please try again.",
      success: false,
    };
  }
}
