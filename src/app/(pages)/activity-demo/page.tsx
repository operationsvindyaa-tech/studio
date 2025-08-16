
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, ClipboardCheck } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createDemoRequest } from "./actions";
import { useToast } from "@/hooks/use-toast";

const demoFormSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(10, "A valid phone number is required."),
  email: z.string().email("A valid email is required."),
  activityName: z.string({ required_error: "Please select an activity." }),
  preferredDate: z.date({ required_error: "Please select a date." }),
});

type DemoFormValues = z.infer<typeof demoFormSchema>;

const initialState = {
    message: "",
    success: false,
};

const activities = [
    "Bharatanatyam", "Vocal Carnatic", "Keyboard/Piano", "Guitar",
    "Yoga", "Western Dance", "Art & Craft", "Karate", "Kalaripayattu", "Zumba", "Gymnastics"
];

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="animate-spin" /> : "Request Demo Class"}
        </Button>
    );
}

export default function ActivityDemoPage() {
    const [state, formAction] = useActionState(createDemoRequest, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    const form = useForm<DemoFormValues>({
        resolver: zodResolver(demoFormSchema),
        defaultValues: {
            studentName: "",
            phone: "",
            email: "",
        },
    });

    useEffect(() => {
        if (state.message) {
            toast({
                title: state.success ? "Success!" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            if (state.success) {
                form.reset();
            }
        }
    }, [state, toast, form]);

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <div className="mx-auto bg-muted p-4 rounded-full w-fit mb-2">
                    <ClipboardCheck className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle>Request an Activity Demo</CardTitle>
                <CardDescription>
                    Fill out the form below to schedule a free trial class for any of our activities.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        ref={formRef}
                        action={form.handleSubmit(formAction)}
                        className="space-y-8"
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="studentName" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your Full Name" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="(555) 123-4567" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="activityName" render={({ field }) => (
                                <FormItem><FormLabel>Select Activity</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Choose an activity" /></SelectTrigger></FormControl><SelectContent>
                                    {activities.map(activity => <SelectItem key={activity} value={activity}>{activity}</SelectItem>)}
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="preferredDate" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Preferred Date</FormLabel>
                                    <Popover><PopoverTrigger asChild>
                                        <FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl>
                                    </PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus /></PopoverContent></Popover><FormMessage />
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
