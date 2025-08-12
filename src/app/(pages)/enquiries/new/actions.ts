
"use server";

import { z } from "zod";
import { addEnquiry } from "@/lib/enquiries-db";
import { revalidatePath } from "next/cache";

const enquiryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  contact: z.string().min(10, "A valid contact number is required."),
  email: z.string().email("A valid email is required."),
  courseInterest: z.string({ required_error: "Please select a course." }),
  source: z.string({ required_error: "This field is required."}),
  notes: z.string().optional(),
});


type State = {
    message: string;
    success: boolean;
};

export async function createEnquiry(prevState: State, formData: z.infer<typeof enquiryFormSchema>): Promise<State> {
  try {
     const parsedData = enquiryFormSchema.parse(formData);

    await addEnquiry(parsedData);

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
