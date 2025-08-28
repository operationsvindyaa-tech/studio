
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, UserPlus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createStaff } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getBranches, Branch } from "@/lib/branches-db";
import { Checkbox } from "@/components/ui/checkbox";

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
  workingDays: z.array(z.string()).optional().default([]),
  noOfWorkingDays: z.coerce.number().optional(),

  salary: z.coerce.number().min(0, "Salary must be a positive number."),
  accountNumber: z.string().min(5, "A valid bank account number is required."),
  ifscCode: z.string().min(5, "A valid IFSC code is required."),
  benefitsNumber: z.string().min(5, "PF/ESI/PAN number is required."),
});


export type StaffFormValues = z.infer<typeof staffFormSchema>;

const initialState = {
    message: "",
    success: false,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
        {pending ? <Loader2 className="animate-spin" /> : "Add Staff Member"}
        </Button>
    );
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function NewStaffPage() {
  const [state, formAction] = useActionState(createStaff, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    async function fetchBranches() {
      const branchData = await getBranches();
      setBranches(branchData);
    }
    fetchBranches();
  }, []);

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      email: "",
      address: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      role: "",
      reportingManager: "",
      workLocation: "",
      salary: 0,
      accountNumber: "",
      ifscCode: "",
      benefitsNumber: "",
      workingDays: [],
      noOfWorkingDays: 0,
    },
  });
  
  const workingDaysWatch = form.watch('workingDays');

  useEffect(() => {
    if (Array.isArray(workingDaysWatch)) {
      form.setValue('noOfWorkingDays', workingDaysWatch.length);
    }
  }, [workingDaysWatch, form]);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if(state.success) {
        form.reset();
        setPhotoPreview(null);
        router.push('/staff');
      } else if (state.error) {
          try {
            const errors = JSON.parse(state.error);
            // You can loop through errors and set them using form.setError
          } catch(e) { /* ignore json parse error */ }
      }
    }
  }, [state, toast, form, router]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPhotoPreview(dataUrl);
        form.setValue("photo", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto bg-muted p-4 rounded-full w-fit mb-2">
            <UserPlus className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle>Add New Staff Member</CardTitle>
        <CardDescription>
          Fill out the form below to add a new staff member to the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            ref={formRef}
            action={form.handleSubmit((data) => {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (value instanceof Date) {
                        formData.append(key, value.toISOString());
                    } else if (Array.isArray(value)) {
                        value.forEach(item => formData.append(key, item));
                    } else if (value !== undefined && value !== null) {
                        formData.append(key, String(value));
                    }
                });
                formAction(formData);
            })}
            className="space-y-12"
          >
            {/* Personal Information */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-2">Personal Information</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                         <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="dob" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Date of Birth</FormLabel>
                                    <Popover><PopoverTrigger asChild>
                                        <FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl>
                                    </PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1950} toYear={new Date().getFullYear()} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="gender" render={({ field }) => (
                                <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>
                     <div className="md:col-span-1">
                        <FormField control={form.control} name="photo" render={() => (
                            <FormItem className="flex flex-col items-center text-center">
                            <FormLabel className="sr-only">Staff Photo</FormLabel>
                            <FormControl>
                                <div>
                                    <Input type="file" accept="image/*" className="hidden" id="photo-upload" onChange={handlePhotoChange}/>
                                    <label htmlFor="photo-upload" className="cursor-pointer">
                                        <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-2 border-dashed mx-auto">
                                            {photoPreview ? <Image src={photoPreview} alt="Staff photo" width={128} height={128} className="rounded-full object-cover w-full h-full" /> : <span className="text-sm text-muted-foreground">Upload Photo</span>}
                                        </div>
                                    </label>
                                </div>
                            </FormControl><FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="contactNumber" render={({ field }) => (
                        <FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="emergencyContactName" render={({ field }) => (
                        <FormItem><FormLabel>Emergency Contact Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="emergencyContactNumber" render={({ field }) => (
                        <FormItem><FormLabel>Emergency Contact Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </div>

            {/* Job Details */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-2">Job Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="department" render={({ field }) => (
                        <FormItem><FormLabel>Department</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Academics">Academics</SelectItem><SelectItem value="Administration">Administration</SelectItem><SelectItem value="Support Staff">Support Staff</SelectItem><SelectItem value="Management">Management</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="role" render={({ field }) => (
                        <FormItem><FormLabel>Role / Designation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="reportingManager" render={({ field }) => (
                        <FormItem><FormLabel>Reporting Manager</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="dateOfJoining" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Date of Joining</FormLabel>
                            <Popover><PopoverTrigger asChild>
                                <FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl>
                            </PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="employmentType" render={({ field }) => (
                        <FormItem><FormLabel>Employment Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Full-time">Full-time</SelectItem><SelectItem value="Part-time">Part-time</SelectItem><SelectItem value="Contract">Contract</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="workLocation" render={({ field }) => (
                        <FormItem><FormLabel>Work Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="branch" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a branch" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch.id} value={branch.name}>
                                {branch.name} ({branch.location})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name="noOfWorkingDays" render={({ field }) => (
                        <FormItem><FormLabel>No. of Working Days</FormLabel><FormControl><Input type="number" {...field} readOnly className="bg-muted"/></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField
                    control={form.control}
                    name="workingDays"
                    render={() => (
                        <FormItem>
                            <FormLabel>Working Days</FormLabel>
                            <div className="flex flex-wrap gap-4">
                                {daysOfWeek.map((day) => (
                                    <FormField
                                        key={day}
                                        control={form.control}
                                        name="workingDays"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(day)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value || []), day])
                                                                : field.onChange(
                                                                    (field.value || []).filter(
                                                                        (value) => value !== day
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">{day}</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
             {/* Payroll Information */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-2">Payroll Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="salary" render={({ field }) => (
                        <FormItem><FormLabel>Salary (per month)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="benefitsNumber" render={({ field }) => (
                        <FormItem><FormLabel>PF/ESI/PAN Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="accountNumber" render={({ field }) => (
                        <FormItem><FormLabel>Bank Account Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="ifscCode" render={({ field }) => (
                        <FormItem><FormLabel>IFSC Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </div>
            
            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
