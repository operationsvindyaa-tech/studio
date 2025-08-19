
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Loader2, ClipboardList, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createEnquiry } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const enquiryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().min(1, "Age is required."),
  activity: z.string({ required_error: "Please select an activity." }),
  contactNumber: z.string().min(10, "A valid contact number is required."),
  whatsappNumber: z.string().min(10, "A valid WhatsApp number is required."),
  branch: z.string({ required_error: "Please select a branch." }),
  coordinator: z.string({ required_error: "Please select a coordinator." }),
  satisfaction: z.number().min(1, "Please provide a rating.").max(5),
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

const activities = [
    "Bharatanatyam", "Vocal Carnatic", "Keyboard/Piano", "Guitar",
    "Yoga", "Western Dance", "Art & Craft", "Karate", "Kalaripayattu", "Zumba", "Gymnastics"
];

const branches = [
    "Main Campus (Basavanapura)",
    "Branch 2 (Marathahalli)",
    "Branch 3 (Koramangala)",
    "Branch 4 (Indiranagar)",
    "Branch 5 (Jayanagar)",
];

const coordinators = [
    "Mr. Anand Kumar",
    "Ms. Sunita Reddy",
    "Mr. Rajesh Sharma",
    "Ms. Priya Menon",
];

export default function NewEnquiryPage() {
  const [state, formAction] = useActionState(createEnquiry, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      name: "",
      age: 0,
    },
  });
  
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if(state.success) {
        form.reset();
        setRating(0);
        router.push('/enquiries');
      }
    }
  }, [state, toast, form, router]);

  const onFormSubmit = (data: EnquiryFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
    });
    formAction(formData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
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
            className="space-y-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" placeholder="Enter age" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            
            <FormField control={form.control} name="activity" render={({ field }) => (
                <FormItem><FormLabel>Activity</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an activity" /></SelectTrigger></FormControl><SelectContent>
                    {activities.map(activity => <SelectItem key={activity} value={activity}>{activity}</SelectItem>)}
                </SelectContent></Select><FormMessage /></FormItem>
            )} />

             <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="contactNumber" render={({ field }) => (
                    <FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input placeholder="(555) 123-4567" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="whatsappNumber" render={({ field }) => (
                    <FormItem><FormLabel>WhatsApp Number</FormLabel><FormControl><Input placeholder="(555) 123-4567" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="branch" render={({ field }) => (
                    <FormItem><FormLabel>Branch</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a branch" /></SelectTrigger></FormControl><SelectContent>
                        {branches.map(branch => <SelectItem key={branch} value={branch}>{branch}</SelectItem>)}
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="coordinator" render={({ field }) => (
                    <FormItem><FormLabel>Coordinator</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a coordinator" /></SelectTrigger></FormControl><SelectContent>
                        {coordinators.map(coord => <SelectItem key={coord} value={coord}>{coord}</SelectItem>)}
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
            </div>

            <FormField control={form.control} name="satisfaction" render={({ field }) => (
                <FormItem>
                    <FormLabel>Customer Satisfaction</FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-8 w-8 cursor-pointer transition-colors ${
                                        rating >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                                    }`}
                                    onClick={() => {
                                        setRating(star);
                                        field.onChange(star);
                                    }}
                                />
                            ))}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
