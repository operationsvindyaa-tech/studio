
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const bookingFormSchema = z.object({
  center: z.string({ required_error: "Please select a center." }),
  bookingDate: z.date({ required_error: "Please select a date." }),
  timeSlot: z.string({ required_error: "Please select a time slot." }),
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("A valid email is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  purpose: z.string().min(3, "Please specify the purpose of the booking."),
});


type State = {
    message: string;
    success: boolean;
};

export async function createBooking(prevState: State, formData: z.infer<typeof bookingFormSchema>): Promise<State> {
  try {
    const parsedData = bookingFormSchema.parse(formData);

    console.log("New Booking Received:", parsedData);
    // Here you would typically save the booking to a database,
    // check for availability, and handle payment processing.

    revalidatePath("/studio-booking");
    
    return {
      message: "Your booking request has been submitted successfully! We will contact you shortly to confirm.",
      success: true,
    };
  } catch (error) {
    console.error("Error creating booking:", error);
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
