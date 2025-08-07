
"use server";

import { z } from "zod";

const studentFormSchema = z.object({
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

export async function createStudent(prevState: State, formData: z.infer<typeof studentFormSchema>): Promise<State> {
  try {
    // Here you would typically save the data to a database.
    // For this example, we'll just log it to the console.
    console.log("New Student Created:");
    console.log(formData);
    
    // You can add logic here to send confirmation emails, etc.
    // The `photo` field will contain a base64 data URI if a photo was uploaded.
    // You might want to save this to a file storage service.

    return {
      message: "Student has been created successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error creating student:", error);
    return {
      message: "There was an error creating the student. Please try again.",
      success: false,
    };
  }
}
