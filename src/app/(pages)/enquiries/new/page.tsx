
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
import { Loader2, ClipboardList } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createEnquiry } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const enquiryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  contact: z.string().min(10, "A valid contact number is required."),
  email: z.string().email("A valid email is required."),
  courseInterest: z.string({ required_error: "Please select a course." }),
  source: z.string({ required_error: "This field is required."}),
  notes: z.string().optional(),
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

  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      name: "",
      contact: "",
      email: "",
      notes: "",
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
        router.push('/enquiries');
      }
    }
  }, [state, toast, form, router]);


  const onFormSubmit = (data: EnquiryFormValues) => {
    formAction(data);
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
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="contact" render={({ field }) => (
                    <FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input placeholder="(555) 123-4567" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Email ID</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="courseInterest" render={({ field }) => (
                    <FormItem><FormLabel>Course of Interest</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger></FormControl><SelectContent>
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
                <FormField control={form.control} name="source" render={({ field }) => (
                    <FormItem><FormLabel>Source of Enquiry</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a source" /></SelectTrigger></FormControl><SelectContent><SelectItem value="social-media">Social Media</SelectItem><SelectItem value="friend-referral">Friend/Referral</SelectItem><SelectItem value="advertisement">Advertisement</SelectItem><SelectItem value="search-engine">Search Engine</SelectItem><SelectItem value="walk-in">Walk-in</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
            </div>

            <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem><FormLabel>Notes (Optional)</FormLabel><FormControl><Textarea placeholder="Add any relevant notes here..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
