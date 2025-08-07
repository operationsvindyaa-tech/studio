"use server";

import { z } from "zod";

const admissionFormSchema = z.object({
    studentName: z.string(),
    dob: z.date(),
    gender: z.enum(["male", "female", "other"]),
    parentName: z.string(),
    parentEmail: z.string().email(),
    parentPhone: z.string(),
    previousSchool: z.string().optional(),
    desiredCourse: z.string(),
    additionalInfo: z.string().optional(),
});

type State = {
    message: string;
    success: boolean;
};

export async function createAdmission(prevState: State, formData: z.infer<typeof admissionFormSchema>): Promise<State> {
  try {
    // Here you would typically save the data to a database.
    // For this example, we'll just log it to the console.
    console.log("New Admission Application Received:");
    console.log(formData);
    
    // You can add logic here to send confirmation emails, etc.

    return {
      message: "Your application has been submitted successfully! We will get back to you soon.",
      success: true,
    };
  } catch (error) {
    console.error("Error creating admission:", error);
    return {
      message: "There was an error submitting your application. Please try again.",
      success: false,
    };
  }
}
