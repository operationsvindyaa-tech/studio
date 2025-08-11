
"use server";

import { z } from "zod";
import { addStudent } from "@/lib/db";
import { revalidatePath } from "next/cache";

const studentFormSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters."),
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
    const parsedData = studentFormSchema.parse(formData);

    await addStudent({
      name: parsedData.studentName,
      status: parsedData.status,
      dateOfJoining: parsedData.dateOfJoining,
      email: parsedData.email,
    } as any);

    revalidatePath("/students");

    return {
      message: "Student has been created successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error creating student:", error);
    if (error instanceof z.ZodError) {
        return {
            message: "Validation failed: " + error.errors.map(e => e.message).join(', '),
            success: false,
        }
    }
    return {
      message: "There was an error creating the student. Please try again.",
      success: false,
    };
  }
}
