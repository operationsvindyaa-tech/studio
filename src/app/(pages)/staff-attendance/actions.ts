
"use server";

import type { Staff } from "@/lib/staff-db";

type State = {
    message: string;
    success: boolean;
};

// This is a placeholder for a more complex notification system (e.g., email, SMS)
export async function notifyStaffMember(staff: Staff, reason: string): Promise<State> {
    const contact = staff.personalInfo.contactNumber || staff.personalInfo.email;

    if (!contact) {
        return {
            message: `Could not send notification. No contact information found for ${staff.fullName}.`,
            success: false,
        };
    }
    
    const message = `Hi ${staff.fullName}, this is a notification regarding your attendance today, ${new Date().toLocaleDateString()}. Reason: ${reason}. Please contact HR for any queries. Thank you.`;

    try {
        // In a real application, you would integrate with an email or SMS service here.
        console.log(`Sending notification to ${contact}: ${message}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

        return {
            message: `A notification has been sent to ${staff.fullName}.`,
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
