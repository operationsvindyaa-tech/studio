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
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useFormState, useFormStatus } from "react-dom";
import { createAdmission } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";


const admissionFormSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters."),
  dob: z.date({ required_error: "A date of birth is required." }),
  gender: z.enum(["male", "female", "other"]),
  parentName: z.string().min(2, "Parent's name must be at least 2 characters."),
  parentEmail: z.string().email("Please enter a valid email address."),
  parentPhone: z.string().min(10, "Phone number must be at least 10 digits."),
  previousSchool: z.string().optional(),
  desiredCourse: z.string({ required_error: "Please select a course." }),
  additionalInfo: z.string().max(500, "Message must not exceed 500 characters.").optional(),
});

export type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

const initialState = {
    message: "",
    success: false,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
        {pending ? <Loader2 className="animate-spin" /> : "Submit Application"}
        </Button>
    );
}


export default function NewAdmissionPage() {
  const [state, formAction] = useFormState(createAdmission, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues: {
      studentName: "",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      previousSchool: "",
      additionalInfo: "",
    },
  });
  
  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if(state.success) {
        form.reset();
        router.push('/admissions');
      }
    }
  }, [state, toast, form, router]);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>New Admission Application</CardTitle>
        <CardDescription>
          Fill out the form below to apply for admission.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            ref={formRef}
            action={form.handleSubmit(data => formAction(data))}
            className="space-y-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Student Information</h3>
                    <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="previousSchool"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Previous School (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="Springfield Elementary" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                 <div className="space-y-4">
                    <h3 className="text-lg font-medium">Parent/Guardian Information</h3>
                    <FormField
                    control={form.control}
                    name="parentName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="parentEmail"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                            <Input placeholder="jane.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="parentPhone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            </div>
            
            <FormField
                control={form.control}
                name="desiredCourse"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Desired Course</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a course to apply for" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="web-dev">Introduction to Web Development</SelectItem>
                            <SelectItem value="data-science">Advanced Data Science with Python</SelectItem>
                            <SelectItem value="digital-marketing">Digital Marketing Fundamentals</SelectItem>
                            <SelectItem value="graphic-design">Graphic Design Masterclass</SelectItem>
                            <SelectItem value="pmp">Project Management Professionals (PMP)</SelectItem>
                            <SelectItem value="well-being">The Science of Well-being</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Additional Information (Optional)</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Please provide any other information you think is relevant."
                        className="resize-none"
                        {...field}
                        />
                    </FormControl>
                     <FormDescription>
                        You can mention achievements, special needs, or any questions you have.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
