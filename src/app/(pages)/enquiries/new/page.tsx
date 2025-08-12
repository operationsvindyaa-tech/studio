
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
import { CalendarIcon, Loader2, ClipboardList } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createEnquiry } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const enquiryFormSchema = z.object({
  photo: z.string().optional(),
  studentName: z.string().min(2, "Name must be at least 2 characters."),
  dateOfJoining: z.date({ required_error: "Date of joining is required." }),
  dob: z.date({ required_error: "A date of birth is required." }),
  age: z.string().min(1, "Age is required."),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender." }),
  nationality: z.string().min(2, "Nationality is required."),
  bloodGroup: z.string().optional(),
  
  fatherName: z.string().min(2, "Father's name is required."),
  fatherContact: z.string().min(10, "Father's contact number is required."),
  motherName: z.string().min(2, "Mother's name is required."),
  motherContact: z.string().min(10, "Mother's contact number is required."),
  whatsappNumber: z.string().min(10, "WhatsApp number is required."),
  email: z.string().email("A valid email is required."),
  address: z.string().min(10, "Address is required."),
  
  previousSchool: z.string().optional(),
  desiredCourse: z.string({ required_error: "Please select a course." }),
  activitiesInterested: z.string().optional(),
  howDidYouKnow: z.string({ required_error: "This field is required."}),
  
  healthIssues: z.string().optional(),
  emergencyContact: z.string().min(10, "Emergency contact is required."),
  
  signature: z.string().min(1, "Signature is required to authorize."),
});


export type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;

const initialState = {
    message: "",
    success: false,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
        {pending ? <Loader2 className="animate-spin" /> : "Submit Enquiry"}
        </Button>
    );
}

export default function NewEnquiryPage() {
  const [state, formAction] = useActionState(createEnquiry, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      studentName: "",
      age: "",
      nationality: "",
      fatherName: "",
      fatherContact: "",
      motherName: "",
      motherContact: "",
      whatsappNumber: "",
      email: "",
      address: "",
      previousSchool: "",
      activitiesInterested: "",
      healthIssues: "",
      emergencyContact: "",
      signature: "",
    },
  });

  const dob = form.watch("dob");

  useEffect(() => {
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      form.setValue("age", age.toString());
    }
  }, [dob, form]);
  
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
        router.push('/enquiries');
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

  const onFormSubmit = (data: EnquiryFormValues) => {
    formAction(data);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto bg-muted p-4 rounded-full w-fit mb-2">
            <ClipboardList className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle>New Enquiry</CardTitle>
        <CardDescription>
          Fill out the form below to add a new enquiry to the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            ref={formRef}
            action={() => form.handleSubmit(onFormSubmit)()}
            className="space-y-12"
          >
            <div className="grid md:grid-cols-3 gap-8">
                {/* Form Fields Column */}
                <div className="md:col-span-2 space-y-12">
                     {/* Student Details */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold border-b pb-2">Student Details</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="studentName" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} className="uppercase" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="dateOfJoining" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Prospective Joining Date</FormLabel>
                                    <Popover><PopoverTrigger asChild>
                                        <FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd-MM-yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl>
                                    </PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="dob" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Date of Birth</FormLabel>
                                    <Popover><PopoverTrigger asChild>
                                        <FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd-MM-yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl>
                                    </PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar
                                        mode="single"
                                        captionLayout="dropdown-buttons"
                                        fromYear={new Date().getFullYear() - 70}
                                        toYear={new Date().getFullYear()}
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date > new Date()}
                                        initialFocus
                                        /></PopoverContent></Popover><FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="age" render={({ field }) => (
                                <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" placeholder="Age (auto-calculated)" {...field} readOnly className="bg-muted" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="gender" render={({ field }) => (
                                <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="nationality" render={({ field }) => (
                                <FormItem><FormLabel>Nationality</FormLabel><FormControl><Input placeholder="American" {...field} className="uppercase" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="bloodGroup" render={({ field }) => (
                                <FormItem><FormLabel>Blood Group (Optional)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger></FormControl><SelectContent><SelectItem value="A+">A+</SelectItem><SelectItem value="A-">A-</SelectItem><SelectItem value="B+">B+</SelectItem><SelectItem value="B-">B-</SelectItem><SelectItem value="AB+">AB+</SelectItem><SelectItem value="AB-">AB-</SelectItem><SelectItem value="O+">O+</SelectItem><SelectItem value="O-">O-</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>
                </div>

                {/* Photo Upload Column */}
                <div className="md:col-span-1">
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold border-b pb-2">Student Photo</h3>
                        <FormField
                            control={form.control}
                            name="photo"
                            render={() => (
                                <FormItem className="flex flex-col items-center text-center">
                                <FormLabel className="sr-only">Student Photo</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="photo-upload"
                                            onChange={handlePhotoChange}
                                        />
                                        <label htmlFor="photo-upload" className="cursor-pointer">
                                            <div className="w-40 h-40 rounded-full bg-muted flex items-center justify-center border-2 border-dashed mx-auto">
                                                {photoPreview ? (
                                                    <Image src={photoPreview} alt="Student photo" width={160} height={160} className="rounded-full object-cover w-full h-full" />
                                                ) : (
                                                    <span className="text-sm text-muted-foreground text-center">Upload Photo</span>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </FormControl>
                                <FormDescription>Click above to upload a photo.</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Parent/Guardian Information */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-2">Parent/Guardian Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="fatherName" render={({ field }) => (
                        <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input placeholder="Robert Doe" {...field} className="uppercase" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="fatherContact" render={({ field }) => (
                        <FormItem><FormLabel>Father's Contact No.</FormLabel><FormControl><Input placeholder="(555) 111-2222" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="motherName" render={({ field }) => (
                        <FormItem><FormLabel>Mother's Name</FormLabel><FormControl><Input placeholder="Susan Doe" {...field} className="uppercase" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="motherContact" render={({ field }) => (
                        <FormItem><FormLabel>Mother's Contact No.</FormLabel><FormControl><Input placeholder="(555) 333-4444" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="whatsappNumber" render={({ field }) => (
                        <FormItem><FormLabel>WhatsApp Number</FormLabel><FormControl><Input placeholder="(555) 555-5555" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email ID</FormLabel><FormControl><Input type="email" placeholder="parent@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Textarea placeholder="123 Main Street, Anytown, USA 12345" {...field} className="uppercase" /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            
             {/* Academic and Other Details */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-2">Academic & Other Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="previousSchool" render={({ field }) => (
                        <FormItem><FormLabel>Previous School/College (Optional)</FormLabel><FormControl><Input placeholder="Anytown High School" {...field} className="uppercase" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="desiredCourse" render={({ field }) => (
                        <FormItem><FormLabel>Desired Course</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger></FormControl><SelectContent>
                            <SelectItem value="bharatanatyam">Bharatanatyam</SelectItem>
                            <SelectItem value="vocal-carnatic">Vocal Carnatic</SelectItem>
                            <SelectItem value="keyboard-piano">Keyboard/Piano</SelectItem>
                            <SelectItem value="guitar">Guitar</SelectItem>
                            <SelectItem value="yoga">Yoga</SelectItem>
                            <SelectItem value="western-dance">Western Dance</SelectItem>
                            <SelectItem value="art-craft">Art & Craft</SelectItem>
                            <SelectItem value="karate">Karate</SelectItem>
                            <SelectItem value="kalaripayattu">Kalaripayattu</SelectItem>
                            <SelectItem value="zumba">Zumba</SelectItem>
                            <SelectItem value="gymnastics">Gymnastics</SelectItem>
                        </SelectContent></Select><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="activitiesInterested" render={({ field }) => (
                    <FormItem><FormLabel>Activities Interested In (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., Sports, Music, Coding Club" {...field} className="uppercase" /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="howDidYouKnow" render={({ field }) => (
                    <FormItem><FormLabel>How did you know about the academy?</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger></FormControl><SelectContent><SelectItem value="social-media">Social Media</SelectItem><SelectItem value="friend-referral">Friend/Referral</SelectItem><SelectItem value="advertisement">Advertisement</SelectItem><SelectItem value="search-engine">Search Engine</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
            </div>

            {/* Health and Emergency */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-2">Health & Emergency Information</h3>
                <FormField control={form.control} name="healthIssues" render={({ field }) => (
                    <FormItem><FormLabel>Any known health issues? (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., Allergies, asthma" {...field} className="uppercase" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="emergencyContact" render={({ field }) => (
                    <FormItem><FormLabel>Emergency Contact Number</FormLabel><FormControl><Input placeholder="(555) 999-0000" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            {/* Authorization */}
            <div className="space-y-6">
                 <h3 className="text-xl font-semibold border-b pb-2">Authorization</h3>
                <FormField control={form.control} name="signature" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Signature of Authorization</FormLabel>
                        <FormControl><Input placeholder="Type your full name to sign" {...field} className="uppercase" /></FormControl>
                        <FormDescription>By typing your name, you certify that all information is correct.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
