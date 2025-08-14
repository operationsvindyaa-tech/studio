
"use server";

import type { Teacher } from "@/lib/teachers-db";

type State = {
    message: string;
    success: boolean;
};

// This is a placeholder for a more complex notification system (e.g., email, SMS)
export async function notifyTeacher(teacher: Teacher, reason: string): Promise<State> {
    const contact = teacher.phone || teacher.email;

    if (!contact) {
        return {
            message: `Could not send notification. No contact information found for ${teacher.name}.`,
            success: false,
        };
    }
    
    const message = `Hi ${teacher.name}, this is a notification regarding your attendance today, ${new Date().toLocaleDateString()}. Reason: ${reason}. Please contact administration for any queries. Thank you.`;

    try {
        // In a real application, you would integrate with an email or SMS service here.
        console.log(`Sending notification to ${contact}: ${message}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

        return {
            message: `A notification has been sent to ${teacher.name}.`,
            success: true,
        };

    } catch (error) {
        console.error("Notification Sending Error:", error);
        return {
            message: "There was an error sending the notification. Please try again.",
            success: false,
        };
    }
}
