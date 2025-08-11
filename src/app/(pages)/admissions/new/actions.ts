
"use server";

import { z } from "zod";
import { addStudent } from "@/lib/db";
import { revalidatePath } from "next/cache";

const admissionFormSchema = z.object({
  photo: z.string().optional(),
  studentName: z.string().min(2, "Name must be at least 2 characters."),
  dateOfJoining: z.date({ required_error: "Date of joining is required." }),
  dob: z.date({ required_error: "A date of birth is required." }),
  age: z.string().min(1, "Age is required."),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender." }),
  nationality: z.string().min(2, "Nationality is required."),
  bloodGroup: z.string().optional(),
  
  fatherName: z.string().min(2, "Father's name is required."),
  fatherContact: z.string().min(10, "Father's contact number is required."),
  motherName: z.string().min(2, "Mother's name is required."),
  motherContact: z.string().min(10, "Mother's contact number is required."),
  whatsappNumber: z.string().min(10, "WhatsApp number is required."),
  email: z.string().email("A valid email is required."),
  address: z.string().min(10, "Address is required."),
  
  previousSchool: z.string().optional(),
  desiredCourse: z.string({ required_error: "Please select a course." }),
  activitiesInterested: z.string().optional(),
  howDidYouKnow: z.string({ required_error: "This field is required."}),
  
  healthIssues: z.string().optional(),
  emergencyContact: z.string().min(10, "Emergency contact is required."),
  
  signature: z.string().min(1, "Signature is required."),
});


type State = {
    message: string;
    success: boolean;
};

export async function createAdmission(prevState: State, formData: z.infer<typeof admissionFormSchema>): Promise<State> {
  try {
     const parsedData = admissionFormSchema.parse(formData);

    await addStudent({
      name: parsedData.studentName,
      status: "Active", // New admissions are active by default
      dateOfJoining: parsedData.dateOfJoining,
      dob: parsedData.dob,
      email: parsedData.email,
    } as any);

    // This tells Next.js to re-fetch the data for the /students page on the next visit.
    revalidatePath("/students");
    
    return {
      message: "Your application has been submitted successfully! We will get back to you soon.",
      success: true,
    };
  } catch (error) {
    console.error("Error creating admission:", error);
    if (error instanceof z.ZodError) {
        return {
            message: "Validation failed: " + error.errors.map(e => e.message).join(', '),
            success: false,
        }
    }
    return {
      message: "There was an error submitting your application. Please try again.",
      success: false,
    };
  }
}
