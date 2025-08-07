
"use server";

import { z } from "zod";

const studentFormSchema = z.object({
  photo: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("A valid email is required."),
  dateOfJoining: z.date({ required_error: "Date of joining is required." }),
  status: z.enum(["Active", "Inactive", "Suspended"], { required_error: "Please select a status." }),
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
    
    // The `photo` field will contain a base64 data URI if a photo was uploaded.
    // You might want to save this to a file storage service.

    return {
      message: "Student has been added successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error creating student:", error);
    return {
      message: "There was an error adding the student. Please try again.",
      success: false,
    };
  }
}
