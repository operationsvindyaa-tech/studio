
"use server";

import { z } from "zod";
import { addStaff } from "@/lib/staff-db";
import { revalidatePath } from "next/cache";

const staffFormSchema = z.object({
  photo: z.string().optional(),
  fullName: z.string().min(2, "Name is required."),
  dob: z.date({ required_error: "Date of birth is required." }),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender is required." }),
  contactNumber: z.string().min(10, "A valid contact number is required."),
  email: z.string().email("A valid email is required."),
  address: z.string().min(10, "Address is required."),
  emergencyContactName: z.string().min(2, "Emergency contact name is required."),
  emergencyContactNumber: z.string().min(10, "A valid emergency contact number is required."),
  
  department: z.enum(["Academics", "Administration", "Support Staff", "Management"], { required_error: "Department is required." }),
  role: z.string().min(2, "Role/Designation is required."),
  reportingManager: z.string().min(2, "Reporting manager is required."),
  dateOfJoining: z.date({ required_error: "Date of joining is required." }),
  employmentType: z.enum(["Full-time", "Part-time", "Contract"], { required_error: "Employment type is required." }),
  workLocation: z.string().min(2, "Work location is required."),
  branch: z.string({ required_error: "Branch is required." }),
  workingDays: z.array(z.string()).optional(),
  noOfWorkingDays: z.coerce.number().optional(),

  salary: z.coerce.number().min(0, "Salary must be a positive number."),
  accountNumber: z.string().min(5, "A valid bank account number is required."),
  ifscCode: z.string().min(5, "A valid IFSC code is required."),
  benefitsNumber: z.string().min(5, "PF/ESI/PAN number is required."),
});


type State = {
    message: string;
    success: boolean;
    error?: string;
};

export async function createStaff(prevState: State, formData: FormData): Promise<State> {
  try {
    const data = Object.fromEntries(formData);
    // Handle array from FormData
    const workingDays = formData.getAll("workingDays");
    
    const parsedData = staffFormSchema.parse({
        ...data,
        workingDays: workingDays,
        dob: new Date(data.dob as string),
        dateOfJoining: new Date(data.dateOfJoining as string),
        salary: Number(data.salary)
    });

    await addStaff({
      fullName: parsedData.fullName,
      personalInfo: {
        dob: parsedData.dob.toISOString(),
        gender: parsedData.gender,
        contactNumber: parsedData.contactNumber,
        email: parsedData.email,
        address: parsedData.address,
        emergencyContact: {
            name: parsedData.emergencyContactName,
            number: parsedData.emergencyContactNumber,
        },
        photo: parsedData.photo || "",
      },
      jobDetails: {
        department: parsedData.department,
        role: parsedData.role,
        reportingManager: parsedData.reportingManager,
        dateOfJoining: parsedData.dateOfJoining.toISOString(),
        employmentType: parsedData.employmentType,
        workLocation: parsedData.workLocation,
        branch: parsedData.branch,
        workingDays: parsedData.workingDays,
      },
      payroll: {
          salary: parsedData.salary,
          bankDetails: {
              accountNumber: parsedData.accountNumber,
              ifscCode: parsedData.ifscCode,
          },
          benefitsNumber: parsedData.benefitsNumber,
      }
    });

    revalidatePath("/staff");
    
    return {
      message: "New staff member has been added successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error creating staff member:", error);
    if (error instanceof z.ZodError) {
        return {
            message: "Validation failed.",
            success: false,
            error: JSON.stringify(error.flatten().fieldErrors),
        }
    }
    return {
      message: "There was an error creating the staff member. Please try again.",
      success: false,
      error: (error as Error).message,
    };
  }
}
