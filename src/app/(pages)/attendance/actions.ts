
"use server";

import type { Student } from "@/lib/db";

type State = {
    message: string;
    success: boolean;
};

export async function notifyParentOfAbsence(student: Student): Promise<State> {
    const parentContact = student.whatsappNumber;

    if (!parentContact) {
        return {
            message: `Could not send notification. No contact number found for ${student.name}'s parent.`,
            success: false,
        };
    }
    
    const message = `Dear Parent, this is to inform you that your child, ${student.name}, was absent from their class today, ${new Date().toLocaleDateString()}. Please contact the administration for any queries. Thank you, VINDYAA - The Altitude of Art.`;

    try {
        // Here you would integrate with an SMS gateway like Twilio, Vonage, etc.
        // For demonstration, we'll just simulate a successful API call.
        console.log(`Sending SMS to ${parentContact}: ${message}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

        return {
            message: `An SMS notification has been sent to the parent of ${student.name}.`,
            success: true,
        };

    } catch (error) {
        console.error("SMS Sending Error:", error);
        return {
            message: "There was an error sending the notification. Please try again.",
            success: false,
        };
    }
}
